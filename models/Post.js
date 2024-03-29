const  mongoose = require('mongoose')

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
    },
    desc: {
        type: String,
        required: true,
    },
    photo: {
        type: String,
        default: '',
    },
    username: {
        type: String,
        required: true,
    },
    cateories: {
        type: Array,
        required: true,
    }
},
{
    timestamps: true
}
)

module.exports = mongoose.model('Post', PostSchema)