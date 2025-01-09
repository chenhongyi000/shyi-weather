const Router = require('koa-router');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const CryptoJS = require('crypto-js');

const router = new Router({ prefix: '/auth' });
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const ENCRYPT_KEY = 'your-secret-key-123'; // 需要与前端一致

// 注册路由
router.post('/register', async (ctx) => {
    try {
        const { username, email, password, confirmPassword } = ctx.request.body;
        
        // 验证密码匹配
        if (password !== confirmPassword) {
            return ctx.redirect('/register?error=' + encodeURIComponent('两次输入的密码不匹配'));
        }
        
        // 检查用户是否已存在
        const existingUser = await User.findOne({ 
            $or: [{ email }, { username }] 
        });
        
        if (existingUser) {
            return ctx.redirect('/register?error=' + encodeURIComponent('用户名或邮箱已被使用'));
        }

        // 创建新用户
        const user = new User({ username, email, password });
        await user.save();

        // 注册成功后重定向到登录页
        ctx.redirect('/login');
    } catch (error) {
        ctx.redirect('/register?error=' + encodeURIComponent(error.message));
    }
});

// 登录路由
router.post('/login', async (ctx) => {
    try {
        const { username, password } = ctx.request.body;
        // 解密密码
        const bytes = CryptoJS.AES.decrypt(password, ENCRYPT_KEY);
        const decryptedPassword = bytes.toString(CryptoJS.enc.Utf8);
        // 查找用户
        const user = await User.findOne({ 
            $or: [
                { username }, 
                { email: username }
            ] 
        });
        
        if (!user) {
            ctx.status = 200;
            ctx.body = {
                success: false,
                message: '用户不存在'
            };
            return;
        }
        
        // 验证密码
        const isValid = await user.validatePassword(decryptedPassword);

        if (!isValid) {
            ctx.status = 200;
            ctx.body = {
                success: false,
                message: '密码错误'
            };
            return;
        }

        // 生成 JWT token
        const token = jwt.sign(
            { 
                id: user._id,
                username: user.username 
            },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        // 设置 cookie
        // ctx.cookies.set('token', token, {
        //     httpOnly: true,
        //     maxAge: 24 * 60 * 60 * 1000,
        //     sameSite: 'none',
        //     secure: true,
        // });

        ctx.status = 200;
        ctx.body = {
            code: 200,
            success: true,
            message: '登录成功',
            data: {
                token,
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email
                }
            }
        };
    } catch (error) {
        ctx.status = 200;
        ctx.body = {
            success: false,
            message: error.message
        };
    }
});

// 添加登出路由
router.post('/logout', async (ctx) => {
    ctx.cookies.set('token', null);
    ctx.redirect('/login');
});

module.exports = router; 