const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const quiz = require('./models/quiz');
const quizRoutes = require('./routes/quizRoutes');

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
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.get('/', (req, res) => {
    res.redirect('/quizzes');
});

app.get('/about', (req, res) => {
    res.render('about', {title: 'About'});
});

//quiz routes
app.use('/quizzes', quizRoutes);

//404 page
app.use((req, res) => {
    res.status(404).render('404', {title: '404'});
})
