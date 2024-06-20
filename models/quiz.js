const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const quizSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    question: {
        type: String,
        required: true
    },
    exp: {
        type: Number,
        default: 20,
        required: true
    }
 }, { timestamps: true });

 const Quiz = mongoose.model('Quiz', quizSchema);
 module.exports = Quiz;