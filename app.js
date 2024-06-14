const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const initializePassport = require('./passport-config');
const quizRoutes = require('./routes/quizRoutes');
const authRoutes = require('./routes/authRoutes');

//express app
const app = express();
initializePassport(passport);

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

app.use(session({
    secret: 'secret', 
    resave: false, 
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
  });

app.get('/', (req, res) => {
    res.render('homepage', {title: 'Homepage'});
});

app.get('/about', (req, res) => {
    res.render('about', {title: 'About'});
});

app.get('/about_logged_out', (req, res) => {
    res.render('about_logged_out', {title: 'About'});
});

//quiz routes
app.use('/quizzes', quizRoutes);

//auth routes
app.use('/auth', authRoutes);


//404 page
app.use((req, res) => {
    res.status(404).render('404', {title: '404'});
})
