const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    priority: { type: String, default: 'normal' },
    type: { type: String },
    completed: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
}, {
    toJSON: {
        virtuals: true,
        transform: (doc, ret) => {
            ret.id = ret._id.toString(); 
            delete ret._id;             
            delete ret.__v;             
            return ret;
        }
    }
});

module.exports = mongoose.models.Task || mongoose.model('Task', taskSchema);