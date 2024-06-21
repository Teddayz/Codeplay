const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const initializePassport = require('./passport-config');
const quizRoutes = require('./routes/quizRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const authMiddleware = require('./middleware/authMiddleware');

// Express app
const app = express();
initializePassport(passport);

// Connect to MongoDB Atlas
const dbURI = 'mongodb+srv://Codeplayadmin:Codeplayadmin@codeplay.yquzy4x.mongodb.net/Codeplay?retryWrites=true&w=majority&appName=Codeplay';
mongoose.connect(dbURI)
    .then((result) => app.listen(3000))
    .catch((err) => console.log(err));

// Register view engine
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

// Home route
app.get('/', authMiddleware.forwardAuthenticated, (req, res) => {
    res.render('homepage', {title: 'Homepage'});
});

app.get('/index', authMiddleware.ensureAuthenticated, (req, res) => {
    res.render('index', {title: 'Index'});
});

app.get('/about', authMiddleware.ensureAuthenticated, (req, res) => {
    res.render('about', {title: 'About'});
});

app.get('/about_logged_out', authMiddleware.forwardAuthenticated, (req, res) => {
    res.render('about_logged_out', {title: 'About'});
});

// Quiz routes
app.use('/quizzes', authMiddleware.ensureAuthenticated, quizRoutes);

// User routes
app.use('/user', authMiddleware.ensureAuthenticated, userRoutes);

// Auth routes
app.use('/auth', authRoutes);

// 404 page
app.use((req, res) => {
    res.status(404).render('404', {title: '404'});
});
