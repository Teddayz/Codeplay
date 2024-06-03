const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const quiz = require('./models/quiz');
const Quiz = require('./models/quiz');

//express app
const app = express();

//connect to mongodb database
const dbURI = 'mongodb+srv://Codeplayadmin:Codeplayadmin@codeplay.yquzy4x.mongodb.net/Codeplay?retryWrites=true&w=majority&appName=Codeplay';
mongoose.connect(dbURI)
    .then((result) => app.listen(3000))
    .catch((err) => console.log(err));


//register view engine
app.set('view engine', 'ejs');


app.use(express.static('public'));
app.use(morgan('dev'));

// adding quizzes into the database
app.get('/add-quiz', (req, res) => {
    const quiz = new Quiz({
      title: 'new quiz 3',
      author: 'Codeplayadmin',
      question: 'What is 2 + 2'
    })
  
    quiz.save()
      .then(result => {
        res.send(result);
      })
      .catch(err => {
        console.log(err);
      });
  });

app.get('/', (req, res) => {
    res.redirect('/quizzes');
});

app.get('/about', (req, res) => {
    //res.send('<p>about page</p>');
    res.render('about', {title: 'About'});
});

app.get('/quiz/create', (req, res) => {
    res.render('create-quiz', {title: 'Create Quiz'});
})

app.get('/quizzes', (req, res) => {
    Quiz.find()
    .then(result => {
        res.render('index', { title: 'All Quizzes', quizzes: result })
    })
    .catch(err => {
        console.log(err);
    });
})

//404 page
app.use((req, res) => {
    res.status(404).render('404', {title: '404'});
})
