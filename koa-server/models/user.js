const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, '用户名是必需的'],
        unique: true,
        trim: true,
        minlength: [2, '用户名至少需要2个字符'],
        maxlength: [20, '用户名不能超过20个字符']
    },
    email: {
        type: String,
        required: [true, '邮箱是必需的'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, '请输入有效的邮箱地址']
    },
    password: {
        type: String,
        required: [true, '密码是必需的'],
        minlength: [6, '密码至少需要6个字符']
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastModified: {
        type: Date,
        default: Date.now
    }
});

// 保存前对密码进行加密
userSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 12);
    }
    this.lastModified = new Date();
    next();
});

// 验证密码的方法
userSchema.methods.validatePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema); 