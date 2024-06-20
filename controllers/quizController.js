//quiz_index, quiz_details, quiz_create_get, quiz_create_post, quiz_delete
const Quiz = require('../models/quiz');
const { updateUserExp } = require('../utils/exp');

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
        res.status(404).render('404', { title: 'Quiz not found' });
    })
};

const quiz_create_get = (req, res) => {
    res.render('quizzes/create_quiz', {title: 'Create Quiz'});
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

const completedQuiz = async (req, res) => {
    try {
        const quizId = req.params.id;
        const userId = req.user.id;
        const quiz = await Quiz.findById(quizId);

        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found'});
        }
        const expGained = quiz.exp;
        const { exp, level, levelUp } = await updateUserExp(userId, expGained);
        res.json({message: 'Quiz completed successfully!',
            redirect: '/quizzes'
        });
    } catch(err) {
        res.status(500).json({ message: 'An quiz error has occured'});
    }
}
    

module.exports = {
    quiz_index, 
    quiz_details,
    quiz_create_get,
    quiz_create_post,
    quiz_delete,
    completedQuiz
}