const socketIO = require('socket.io');

const users = new Map();

function initializeSocket(server) {
    const io = socketIO(server);

    io.on('connection', (socket) => {
        // 用户加入
        socket.on('user joined', (user) => {
            users.set(socket.id, user);
            broadcastUsers();
        });

        // 处理聊天消息
        socket.on('chat message', (data) => {
            io.emit('chat message', data);
        });
        socket.on('chat send', (data) => {
            console.log('服务端收到消息', data);
        });
        // 用户断开连接
        socket.on('disconnect', () => {
            users.delete(socket.id);
            broadcastUsers();
        });

        // 广播用户列表
        function broadcastUsers() {
            io.emit('users update', Array.from(users.values()));
        }
    });

    return io;
}

module.exports = initializeSocket; 