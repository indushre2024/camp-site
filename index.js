if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const AppError = require('./utils/AppError');
const reviews = require('./routes/reviews');
const campgrounds = require('./routes/campgrounds');
const userRoute = require('./routes/users');
const session = require('express-session');
const flash = require('connect-flash');
const User = require('./models/user');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const mongoSanitize = require('express-mongo-sanitize');

// const dbUrl = ;
const dbUrl = process.env.DB_URL || 'mongodb://127.0.0.1:27017/yelp-camp';
const mongoStore = require('connect-mongo');
const store = mongoStore.create({
    mongoUrl:dbUrl,
    touchAfter:24*3600,
    crypto:{
        secret:process.env.SECRET || "Keepitasecret"
    }
}
)

mongoose.connect(dbUrl)
.then(s=>{
    console.log("Successfully Connected to Mongo");
})
.catch(e=>{
    console.log("Error connecting to MongoDB");
})


const app = express();
app.set('view engine','ejs');
app.set('views', path.join(__dirname,'views'));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,'/public')));
app.use(flash())
app.use(session(
    {store,
    resave:false, 
    saveUninitialized:false,
    secret:process.env.SECRET || "Keepitasecret",
    cookie:{httpOnly:true, 
    expires:Date.now() + 1000*60*60*24*7,
    maxAge:1000*60*60*24*7}}))

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
app.use(mongoSanitize());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.user = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.get('/',(req,res,next)=>{
    res.render('home');
})

app.use('/users', userRoute);
app.use('/campgrounds', campgrounds);
app.use('/campgrounds/:id/reviews',reviews);


app.all('*',(req,res,next)=>{
    next(new AppError("Page not Found", 400));
})

app.use((err,req,res,next)=>{
    const {statusCode = 500} = err;
    if(!err.message) err.message="Something went wrong!";
    res.status(statusCode).render("error",{err});
})

const port = process.env.PORT || 3000;
app.listen(port,()=>{
    console.log("App listening on port 3000!!!");
})