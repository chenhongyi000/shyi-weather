const mongoose = require('mongoose');

const kanbanSchema = new mongoose.Schema({
    kanbanNo: {
        type: String,
        required: [true, '看板号不能为空'],
        trim: true,
        minlength: [6, '看板号至少需要6个字符']
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    receiveStatus: {
        type: String,
        enum: ['pending', 'received', 'rejected'],
        default: 'pending'
    },
    recordTime: {
        type: Date,
        default: Date.now
    },
    receiveTime: {
        type: Date
    },
    operator: {
        type: String,
        required: [true, '操作人不能为空']
    },
    receiver: {
        type: String
    },
    remark: {
        type: String,
        maxlength: [200, '备注不能超过200个字符']
    }
}, {
    timestamps: true,
    versionKey: false
});

kanbanSchema.index({ kanbanNo: 1 });
kanbanSchema.index({ recordTime: -1 });
kanbanSchema.index({ receiveStatus: 1, receiveTime: -1 });

module.exports = mongoose.model('Kanban', kanbanSchema); 