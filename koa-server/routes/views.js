const Router = require('koa-router');
const auth = require('../middleware/auth');
const User = require('../models/user');
const router = new Router();

// 登录页面
router.get('/login', async (ctx) => {
    await ctx.render('login', {
        error: ctx.query.error || null
    });
});

// 注册页面
router.get('/register', async (ctx) => {
    await ctx.render('register', {
        error: ctx.query.error || null
    });
});

// 主页（需要登录）
router.get('/', auth, async (ctx) => {
    const user = await User.findById(ctx.state.user.id).select('-password');
    await ctx.render('index', {
        user: user
    });
});

// 聊天室页面（需要登录）
router.get('/chat', auth, async (ctx) => {
    const user = await User.findById(ctx.state.user.id).select('-password');
    await ctx.render('chat', {
        user: user
    });
});

module.exports = router; 