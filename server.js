const express=require('express');
const app=express();
const db=require('./db');
require('dotenv').config();
const passport = require('./auth');

// const passport = require('passport');
// const LocalStrategy = require('passport-local').Strategy;
// const Person = require('./models/Person');
 

const bodyParser=require('body-parser');
app.use(bodyParser.json()); //req.body
const PORT=process.env.PORT || 3000;

//Middleware Function
const logRequest=( req, res, next)=>{
    console.log(`[${new Date().toLocaleString()}] Request made to ${req.originalUrl}`);
    next();
}
app.use(logRequest);


// passport.use(new LocalStrategy(async (username, password, done) => {
//     try {
//         // console.log('Received credentials:', username, password);
//         const user = await Person.findOne({username:username});
//         if (!user)
//             return done(null, false, { message: 'Incorrect username.' });
        
//         const isPasswordMatch = user.password === password? true : false;
//         if (isPasswordMatch)
//             return done(null, user);
//         else
//             return done(null, false, { message: 'Incorrect password.' });
//     } catch (err) {
//         return done(err);
//     }
// }));



app.use(passport.initialize());

const localAuthMiddleware=passport.authenticate('local', {session:false});
app.get('/' , localAuthMiddleware,function(req,res){
    res.send('Welcome to my Hotel');
})




//Import the router file
const personRoutes=require('./routes/personRouets');
const menuItemRoutes=require('./routes/menuItemRoutes');



//Use the routers
app.use('/person',localAuthMiddleware,personRoutes);
app.use('/menu' ,menuItemRoutes);


app.listen(PORT,()=>{
    console.log('listening on port 3000');
})















