const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

module.exports = async (ctx, next) => {
    try {
        // 优先从 cookie 获取 token
        let token = ctx.cookies.get('token');
        
        // 如果 cookie 中没有，则从请求头获取
        if (!token) {
            const authorization = ctx.header.authorization;
            if (!authorization) {
                return ctx.redirect('/login');
            }
            token = authorization.replace('Bearer ', '');
        }
        
        // 验证 token
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // 将用户信息添加到上下文中
        ctx.state.user = decoded;
        
        await next();
    } catch (err) {
        return ctx.redirect('/login');
    }
}; 