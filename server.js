const express=require('express')
require('dotenv').config();
const expressLayout=require('express-ejs-layouts');
const path=require('path');
const mongoose=require('mongoose');
const session=require('express-session');
const flash=require('express-flash');
const passport=require('passport');
const MongoDbStore=require('connect-mongo')(session)

//database Connection
mongoose.connect('mongodb://localhost/Food', function (err) {
      if (err) throw err;
      console.log('Successfully connected');
    })

const app=express();
const PORT=process.env.PORT||3000;



//session store
let mongoStore=new MongoDbStore({
    mongooseConnection:mongoose.connection,
    collection:'sessions'
})

//Session config
app.use(session({
    secret:process.env.COOKIE_SECRET,
    resave:false,
    store:mongoStore,
    saveUninitialized:false,
    cookie:{ maxAge : 1000*15 }
}))
//Passport config
const passportInit=require('./app/config/passport')
passportInit(passport)
app.use(passport.initialize())
app.use(passport.session())
app.use(flash());
//Assets
app.use(express.static('public'))
app.use(express.urlencoded({extended:false}))
app.use(express.json())

//Global middleware
app.use((req,res,next)=>{
   res.locals.session=req.session
   res.locals.user=req.user
   next()
})


// set template engine
app.use(expressLayout);
app.set('views',path.join(__dirname,'/resources/views'))
app.set('view engine','ejs')


require('./routes/web')(app);

 

app.listen(PORT,()=>{
    console.log(`listening on port ${PORT}`);
})