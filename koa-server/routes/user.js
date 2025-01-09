const Router = require('koa-router');
const auth = require('../middleware/auth');
const User = require('../models/user');

const router = new Router({ prefix: '/user' });

// 获取当前用户信息
router.get('/profile', auth, async (ctx) => {
    try {
        const user = await User.findById(ctx.state.user.id).select('-password');
        if (!user) {
            ctx.throw(404, '用户不存在');
        }

        ctx.body = {
            success: true,
            data: user
        };
    } catch (error) {
        ctx.throw(400, error.message);
    }
});

// 更新用户信息
router.put('/profile', auth, async (ctx) => {
    try {
        const { username, email } = ctx.request.body;
        const updateData = {};
        
        if (username) updateData.username = username;
        if (email) updateData.email = email;

        const user = await User.findByIdAndUpdate(
            ctx.state.user.id,
            updateData,
            { new: true, runValidators: true }
        ).select('-password');

        ctx.body = {
            success: true,
            message: '用户信息更新成功',
            data: user
        };
    } catch (error) {
        ctx.throw(400, error.message);
    }
});

module.exports = router; 