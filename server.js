const express=require('express');
const app=express();
const db=require('./db');
require('dotenv').config();

const bodyParser=require('body-parser');
app.use(bodyParser.json()); //req.body
const PORT=process.env.PORT || 3000;



app.get('/',function(req,res){
    res.send('Welcome to my Hotel');
})




//Import the router file
const personRoutes=require('./routes/personRouets');
const menuItemRoutes=require('./routes/menuItemRoutes');


//Use the routers
app.use('/person', personRoutes);
app.use('/menu', menuItemRoutes);


app.listen(PORT,()=>{
    console.log('listening on port 3000');
})