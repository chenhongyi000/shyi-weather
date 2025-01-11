const Router = require('koa-router')
const router = new Router()
const Kanban = require('../models/kanban')

// 新增看板记录
router.post('/kanban/add', async (ctx) => {
  try {
    const { kanbanNo, operator, remark } = ctx.request.body
    
    // 参数验证
    if (!kanbanNo || !operator) {
      ctx.status = 400
      ctx.body = {
        code: 400,
        message: '看板号和操作人不能为空'
      }
      return
    }

    // 检查看板号是否已存在
    const existingKanban = await Kanban.findOne({ kanbanNo })
    if (existingKanban) {
      ctx.status = 400
      ctx.body = {
        code: 400,
        message: '看板号已存在'
      }
      return
    }

    // 创建记录
    const kanban = new Kanban({
      kanbanNo,
      operator,
      remark,
      recordTime: new Date()
    })

    await kanban.save()

    ctx.body = {
      code: 200,
      message: '记录成功',
      data: kanban
    }
  } catch (error) {
    console.error('记录看板错误:', error)
    ctx.status = error.status || 500
    ctx.body = {
      code: error.status || 500,
      message: error.message || '服务器错误'
    }
  }
})

// 获取看板记录列表（支持分页和筛选）
router.post('/kanban/list', async (ctx) => {
  try {
    const { 
      page = 1, 
      pageSize = 10, 
      kanbanNo, 
      startTime, 
      endTime,
      operator,
      status,
      receiveStatus,
      receiver
    } = ctx.request.body

    // 构建查询条件
    const query = {}
    if (kanbanNo) {
      query.kanbanNo = new RegExp(kanbanNo, 'i')
    }
    if (operator) {
      query.operator = new RegExp(operator, 'i')
    }
    if (status) {
      query.status = status
    }
    if (receiveStatus) {
      query.receiveStatus = receiveStatus
    }
    if (receiver) {
      query.receiver = new RegExp(receiver, 'i')
    }
    if (startTime || endTime) {
      query.recordTime = {}
      if (startTime) {
        query.recordTime.$gte = new Date(startTime)
      }
      if (endTime) {
        query.recordTime.$lte = new Date(endTime)
      }
    }

    // 计算总数
    const total = await Kanban.countDocuments(query)

    // 获取分页数据
    const records = await Kanban.find(query)
      .sort({ recordTime: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .exec()

    ctx.body = {
      code: 200,
      data: {
        records,
        pagination: {
          total,
          page,
          pageSize
        }
      }
    }
  } catch (error) {
    console.error('获取看板记录错误:', error)
    ctx.status = error.status || 500
    ctx.body = {
      code: error.status || 500,
      message: error.message || '服务器错误'
    }
  }
})

// 根据ID获取看板详情
router.get('/kanban/detail/:id', async (ctx) => {
  try {
    const { id } = ctx.params
    const kanban = await Kanban.findById(id)
    
    if (!kanban) {
      ctx.status = 404
      ctx.body = {
        code: 404,
        message: '看板记录不存在'
      }
      return
    }

    ctx.body = {
      code: 200,
      data: kanban
    }
  } catch (error) {
    console.error('获取看板详情错误:', error)
    ctx.status = error.status || 500
    ctx.body = {
      code: error.status || 500,
      message: error.message || '服务器错误'
    }
  }
})

// 看板收货接口
router.post('/kanban/receive', async (ctx) => {
  try {
    const { kanbanNos, receiver, remark } = ctx.request.body

    // 参数验证
    if (!kanbanNos || !receiver) {
      ctx.status = 400
      ctx.body = {
        code: 400,
        message: '看板号和收货人不能为空'
      }
      return
    }

    // 将单个看板号转换为数组形式
    const kanbanNoArray = Array.isArray(kanbanNos) ? kanbanNos : [kanbanNos]

    // 查找所有相关看板
    const kanbans = await Kanban.find({
      kanbanNo: { $in: kanbanNoArray },
      receiveStatus: 'pending' // 只能收货待收货的看板
    })

    // 检查是否所有看板都存在
    if (kanbans.length !== kanbanNoArray.length) {
      ctx.status = 400
      ctx.body = {
        code: 400,
        message: '部分看板号不存在或已收货'
      }
      return
    }

    // 批量更新看板状态
    const updateResult = await Kanban.updateMany(
      {
        kanbanNo: { $in: kanbanNoArray },
        receiveStatus: 'pending'
      },
      {
        $set: {
          receiveStatus: 'received',
          receiveTime: new Date(),
          receiver,
          remark: remark || ''
        }
      }
    )

    ctx.body = {
      code: 200,
      message: '收货成功',
      data: {
        modifiedCount: updateResult.modifiedCount,
        receivedKanbans: kanbanNoArray
      }
    }
  } catch (error) {
    console.error('看板收货错误:', error)
    ctx.status = error.status || 500
    ctx.body = {
      code: error.status || 500,
      message: error.message || '服务器错误'
    }
  }
})

// 拒收看板
router.post('/kanban/reject', async (ctx) => {
  try {
    const { kanbanNos, receiver, remark } = ctx.request.body

    if (!kanbanNos || !receiver) {
      ctx.status = 400
      ctx.body = {
        code: 400,
        message: '看板号和操作人不能为空'
      }
      return
    }

    const kanbanNoArray = Array.isArray(kanbanNos) ? kanbanNos : [kanbanNos]

    const updateResult = await Kanban.updateMany(
      {
        kanbanNo: { $in: kanbanNoArray },
        receiveStatus: 'pending'
      },
      {
        $set: {
          receiveStatus: 'rejected',
          receiveTime: new Date(),
          receiver,
          remark: remark || ''
        }
      }
    )

    ctx.body = {
      code: 200,
      message: '拒收成功',
      data: {
        modifiedCount: updateResult.modifiedCount,
        rejectedKanbans: kanbanNoArray
      }
    }
  } catch (error) {
    console.error('看板拒收错误:', error)
    ctx.status = error.status || 500
    ctx.body = {
      code: error.status || 500,
      message: error.message || '服务器错误'
    }
  }
})

module.exports = router 