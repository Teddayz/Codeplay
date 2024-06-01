const express = require('express');

//express app
const app = express();

//register view engine
app.set('view engine', 'ejs');

//Listen
app.listen(3000);

app.get('/', (req, res) => {
    res.render('index', {title: 'Home'});
});

app.get('/about', (req, res) => {
    //res.send('<p>about page</p>');
    res.render('about', {title: 'About'});
});

app.get('/quiz/create', (req, res) => {
    res.render('create-quiz', {title: 'Create Quiz'});
})

//404 page
app.use((req, res) => {
    res.status(404).render('404', {title: '404'});
})
