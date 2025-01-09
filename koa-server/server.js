const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const mongoose = require('mongoose');
const cors = require('@koa/cors');
const path = require('path');
const views = require('koa-views');
const serve = require('koa-static');
const http = require('http');

const app = new Koa();
const router = new Router();

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const viewRoutes = require('./routes/views');
const initializeSocket = require('./socket/chat');

// MongoDB 连接配置
const MONGODB_URI = 'mongodb://chat-app:23dBtLzmdh4c6fHK@106.14.182.253:27017/chat-app';
const MONGODB_OPTIONS = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
};

// 连接 MongoDB
mongoose.connect(MONGODB_URI, MONGODB_OPTIONS)
    .then(() => console.log('MongoDB 连接成功'))
    .catch(err => {
        console.error('MongoDB 连接失败:', err);
        process.exit(1);
    });

// 监听数据库连接事件
mongoose.connection.on('error', err => {
    console.error('MongoDB 连接错误:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB 连接断开，尝试重新连接...');
});

// 中间件
app.use(cors());
app.use(bodyParser());

// 配置静态文件服务
app.use(serve(path.join(__dirname, 'public')));

// 配置视图引擎
app.use(views(path.join(__dirname, 'views'), {
    extension: 'ejs'
}));

// 错误处理中间件
app.use(async (ctx, next) => {
    try {
        await next();
    } catch (err) {
        ctx.status = err.status || 500;
        ctx.body = {
            success: false,
            message: err.message
        };
        console.error('服务器错误:', err);
    }
});

// 基础路由
router.get('/', async (ctx) => {
    ctx.body = {
        success: true,
        message: '服务器运行正常'
    };
});
// 基础路由
router.get('/test', async (ctx) => {
    ctx.status = 200
    ctx.body = {
        success: true,
        message: 'test'
    };
});

// 注册视图路由（需要放在其他路由之前）
app.use(viewRoutes.routes()).use(viewRoutes.allowedMethods());

// 注册其他路由
app.use(router.routes()).use(router.allowedMethods());
app.use(authRoutes.routes()).use(authRoutes.allowedMethods());
app.use(userRoutes.routes()).use(userRoutes.allowedMethods());

// 创建 HTTP 服务器
const server = http.createServer(app.callback());

// 初始化 Socket.IO
initializeSocket(server);

// 启动服务器
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
    console.log(`服务器运行在 http://localhost:${PORT}`);
}); 