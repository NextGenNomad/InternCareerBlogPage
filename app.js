const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');
const passport = require('passport');

const authRouter = require('./routes/auth');
const usersRouter = require('./routes/user');
const postRouter = require('./routes/post');
const commentRouter = require('./routes/comments')
const categoryRouter = require('./routes/categories')
const logoutRouter = require('./routes/logout')


const User = require('./models/User');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

const initializePassport = require('./routes/passport');
initializePassport(passport, async (username) => {
    return await User.findOne({ username: username });
});


app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());


//MANGODB
mongoose.connect(process.env.MANGO_DB)
  .then(() => {
    console.log('Connected to the database');
  })
  .catch(err => {
    console.error('Error connecting to the database:', err);
  });

// // MIDDLEWARE
app.use('/auth', authRouter);
app.use('/user', usersRouter);
app.use('/post', postRouter);
app.use('/comments', commentRouter);
app.use('/categories',categoryRouter);
app.use('/',logoutRouter);

// Define routes for various pages
app.get('/', (req, res) => {
  res.render('index', { title: 'Home', user: req.user  });
});

app.get('/create-post', (req, res) => {
  res.render('newpost', { title: 'New Post', user: req.user });
});

app.get('/explore', (req, res) => {
  res.render('explore', { title: 'Explore' });
});

app.get('/blogs', (req, res) => {
  res.render('blogs', { title: 'Blog Page' });
});

app.get('/about-us', (req, res) => {
  res.render('about', { title: 'About Us' });
});

app.get('/contact-us', (req, res) => {
  res.render('contact', { title: 'Contact Us' });
});


app.get('/signin', (req, res) => {
  let messages = {}; 
  if (req.session && req.session.errorMessage) {
    messages = { error: req.session.errorMessage };
    delete req.session.errorMessage;
  }
  res.render('signin', { title: 'Sign In', messages: messages });
});


app.get('/signup', (req, res) => {
  res.render('signup', { title: 'Sign Up' });
});

// Handle undefined routes
app.use((req, res, next) => {
  res.status(404).send('Page not found');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});




// PORT
const PORT = process.env.PORT || 3000;

// PORT LISTEN
app.listen(PORT, () => {
    console.log(`Backend is running on port ${PORT}`);
});

