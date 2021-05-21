const express=require('express')
require('dotenv').config();
const expressLayout=require('express-ejs-layouts');
const path=require('path');
const mongoose=require('mongoose');
const session=require('express-session');
const flash=require('express-flash');
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
app.use(flash());
//Global middleware
app.use((req,res,next)=>{
   res.locals.session=req.session
   next()
})
//Assets
app.use(express.static('public'))
app.use(express.json())
// set template engine
app.use(expressLayout);
app.set('views',path.join(__dirname,'/resources/views'))
app.set('view engine','ejs')


require('./routes/web')(app);

 

app.listen(PORT,()=>{
    console.log(`listening on port ${PORT}`);
})