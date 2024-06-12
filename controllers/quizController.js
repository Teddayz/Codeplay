//quiz_index, quiz_details, quiz_create_get, quiz_create_post, quiz_delete
const Quiz = require('../models/quiz');

const quiz_index = (req, res) => {
    Quiz.find()
    .then(result => {
        res.render('quizzes/index', { title: 'All Quizzes', quizzes: result })
    })
    .catch(err => {
        console.log(err);
    })
}

const quiz_details = (req, res) => {
    const id = req.params.id;
    Quiz.findById(id)
    .then(result => {
        res.render('quizzes/details', { quiz: result, title: 'Quiz Name' })
    })
    .catch(err => {
        console.log(err);
    })
};

const quiz_create_get = (req, res) => {
    res.render('quizzes/create-quiz', {title: 'Create Quiz'});
};

const quiz_create_post = (req, res) => {
    console.log(req.body);
    const quiz = new Quiz(req.body);

    quiz.save()
    .then((result) => {
        res.redirect('/quizzes');
    })
    .catch((err) => {
        console.log(err);
    })
};

const quiz_delete = (req, res) => {
    const id = req.params.id;
    Quiz.findByIdAndDelete(id)
        .then(result => {
        res.json({ redirect: '/quizzes'})
        })
        .catch(err => {
            console.log(err);
        })
    };

module.exports = {
    quiz_index, 
    quiz_details,
    quiz_create_get,
    quiz_create_post,
    quiz_delete
}