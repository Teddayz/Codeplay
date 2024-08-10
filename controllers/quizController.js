//quiz_index, quiz_details, quiz_create_get, quiz_create_post, quiz_delete, completedQuiz, quiz_attempt, quiz_submit
const Quiz = require('../models/quiz');
const User = require('../models/user');

const { updateUserExp } = require('../utils/exp');

const quiz_index = async (req, res) => {
    const language = req.query.language;
    const query = language ? { language } : {};

    try {
        const quizzes = await Quiz.find(query);
        const user_id = req.user.id;
        const user = await User.findById(user_id);

        const completedQuizzes = quizzes.filter(quiz => user.completedQuizzes.includes(quiz._id.toString()));
        const availableQuizzes = quizzes.filter(quiz => !user.completedQuizzes.includes(quiz._id.toString()));

        res.render('quizzes/index', {
            title: 'All Quizzes',
            availableQuizzes,
            completedQuizzes,
            selectedLanguage: language
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred while fetching the quizzes.');
    }
};

const quiz_details = async (req, res) => {
    const id = req.params.id;
    const user_id = req.user.id;

    const user = await User.findById(user_id);

    if (user.completedQuizzes.includes(id)) {
        const error_msg = 'You have already completed this quiz';
        console.log(error_msg);
        return res.render('index', { user, error_msg });
    }
    Quiz.findById(id)
        .then(result => {
            res.render('quizzes/details', { quiz: result, title: 'Quiz Details' });
        })
        .catch(err => {
            res.status(404).render('404', { title: 'Quiz not found' });
        });
};

const quiz_create_get = (req, res) => {
    res.render('quizzes/create_quiz', { title: 'Create Quiz' });
};

const quiz_create_post = (req, res) => {
    const { title, author, questions, exp, language } = req.body;

    const quiz = new Quiz({
        title,
        author,
        questions,
        exp: exp || 20, // Default value if not provided
        language
    });

    quiz.save()
    .then((result) => {
        res.redirect('/quizzes');
    })
    .catch((err) => {
        console.log(err);
        res.status(500).send('An error occurred while saving the quiz.');
    });
};

const quiz_delete = (req, res) => {
    const id = req.params.id;
    Quiz.findByIdAndDelete(id)
        .then(result => {
        res.json({ redirect: '/quizzes' });
        })
        .catch(err => {
            console.log(err);
        });
};


const quiz_attempt = async (req, res) => {
    const id = req.params.id;
    const user_id = req.user.id;

    const user = await User.findById(user_id);

    if (user.completedQuizzes.includes(id)) {
        const error_msg = 'You have already completed this quiz';
        console.log(error_msg);
        res.render('/quizzes', error_msg);
    }
    Quiz.findById(id)
    .then(result => {
        res.render('quizzes/quiz', { quiz: result, title: 'Attempt Quiz' });
    })
    .catch(err => {
        res.status(404).render('404', { title: 'Quiz not found' });
    });
};

const quiz_submit = async (req, res) => {
    const id = req.params.id;
    const { answers } = req.body;

    try {
        const quiz = await Quiz.findById(id);
        const userId = req.user.id;
        const user = await User.findById(userId)
        if (!quiz) {
            return res.status(404).render('404', { title: 'Quiz not found' });
        }

        let score = 0;
        quiz.questions.forEach((question, index) => {
            if (question.correctAnswer === answers[index]) {
                score++;
            }
        });
        const expGained = Math.ceil((score / quiz.questions.length) * quiz.exp);
        const { exp, totalExp, level, levelUp } = await updateUserExp(userId, expGained);
        const expTable = [
            20, 23, 26, 30, 35, 40, 46, 53, 61, 70, 81, 93, 107, 123, 142, 163, 187, 215,
            248, 285, 327, 376, 433, 498, 573, 658, 757, 871, 1001, 1152, 1324, 1523,
            1751, 2014, 2316, 2664, 3063, 3522, 4051, 4658, 5357, 6161, 7085, 8148, 9370,
            10775, 12392, 14250, 16388, 18846, 21673, 24924, 28663, 32962, 37906, 43592,
            50131, 57651, 66299, 76243, 87680, 100832, 115957, 133350, 153353, 176356,
            202809, 233230, 268215, 308447, 354714, 407922, 469110, 539476, 620398,
            713457, 820476, 943547, 1085079, 1247841, 1435018, 1650270, 1897811, 2182482,
            2509855, 2886333, 3319283, 3817175, 4389752, 5048214, 5805447, 6676263,
            7677703, 8829358, 10153762, 11676827, 13428351, 15442603, 17758994, 20422843
          ];
          // Mark the quiz as completed
        user.completedQuizzes.push(id);
        await user.save();

        res.render('quizzes/result', { quiz, score, expGained, exp, level, levelUp, expTable, totalExp, title: 'Quiz Result' });
    } catch (err) {
        console.error('Error submitting quiz:', err);
        res.status(500).send('An error occurred while submitting the quiz.');
    }
};

module.exports = {
    quiz_index,
    quiz_details,
    quiz_create_get,
    quiz_create_post,
    quiz_delete,
    quiz_attempt,
    quiz_submit
};
