const express=require('express');
const router=express.Router();
const Person = require('../models/Person');
const {jwtAuthMiddleware,generateToken}=require('./../jwt');

//POST route to person
router.post('/signup', async(req,res)=>{
    try{
        const data=req.body //Assuming the request body contains the person data 

        //create a new person using Mongoose model
        const newPerson=new Person(data);
    
        const response=await newPerson.save();
        console.log('data saved');

        const payload={
            id:response.id,
            username:response.username
        }
        console.log(JSON.stringify(payload));

        const token=generateToken(payload);
        console.log("Token is:", token);

        res.status(200).json({response:response, token:token});
    }
    catch(err){
        console.log(err);
        res.status(500).json({error:'Internal server error'})
    }
})

//Login Route
router.post('/login',async(req, res)=>{
    try{
        // Extract the username and password from request body
        const {username , password}=req.body
        
        //Find the user by username
        const user=await Person.findOne({username:username});

        if( !user || !(await user.comparePassword(password))){
            return res.status(401).json({error: 'Invalid username and Password'})
        }

        //Generate Token
        const payload={
            id: user.id,
            username: user.username
        }
        const token=generateToken(payload);

        //return token as reponse
        res.json({token})

    }catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal server error'})
    }
})

//Profile route
router.get('/profile',jwtAuthMiddleware, async(req, res,)=>{
    try{
        const userData = req.user;
        console.log("User Data:",userData);

        const userId = userData.id;
        const user = await Person.findById(userId);

        res.status(200).json({user});
    }catch(err){
        console.log(err);
        res.status(500).json({error:'Internal Server Error'});
    }
})


//Get method to get the person
router.get('/',jwtAuthMiddleware ,async(req,res)=>{
    try{
        const data=await Person.find(); 
        console.log('data fetched');
        res.status(200).json(data);
    }catch(err)
    {
        console.log(err);
        res.status(500).json({error:'Internal server error'});
    }
})

router.get('/:workType', async(req, res)=>{
    try{
        const workType=req.params.workType; //Extract the work type form URL parameter
        if(workType == 'chef' || workType == 'manager' || workType == 'waiter')
        {
            const response = await Person.find({work:workType});
            console.log('reponse fetched');
            res.status(200).json(response);
        }
        else{
            res.status(404).json({error:'Invalid Work Type'});
        }
    }catch(err){
        console.log(err);
        res.status(500).json({error:'Internal server error'});
    }
})

router.put('/:id',async(req, res)=>{
    try{
        const personId = req.params.id; //Extract the id from Url parameter
        const updatePersonData = req.body; //update the data for one person

        const response=await Person.findByIdAndUpdate(personId,updatePersonData,{
            new :true, //Return the updated document 
            validator:true // Return  mongoose validation
        })
        
        if(!response)
        {
            return res.status(404).json({error:'person not found'});
        }

        console.log('data updated');
        res.status(200).json(response);
    }catch(err){
        console.log(err);
        res.status(500).json({error:'Internal server error'});
    }
})

router.delete('/:id', async(req, res)=>{
    try{
        const personId = req.params.id; //Extract the id from Url parameter

        //Assume you have person model
        const response = await Person.findByIdAndDelete(personId);
        if(!response){
            return res.status(404).json({err:'person not found'});
        }

        console.log('data deleted');
        res.status(200).json({Message:'Person deleted successfully'});

    }catch(err){
        console.log(err);
        res.status(500).json({error:'Internal Server error'});
    }
})

module.exports = router;