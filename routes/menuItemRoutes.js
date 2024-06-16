const express=require('express');
const router=express.Router();
const menuItem=require('./../models/MenuItem');


//POST method to add Menu item
router.post('/', async(req,res)=>{
    try{
        const menuData = req.body;

        const newMenu = new menuItem(menuData);
        const response= await newMenu.save();
        console.log('data save');
        res.status(200).json(response);
    }catch(err){
        console.log(err);
        res.status(500).json({error:'Internal server error'});
    }
})

//GET method to get menu Item
router.get('/',async(req,res)=>{
    try{
        const itemData= await menuItem.find();
        console.log('data fetched'),
        res.status(200).json(itemData);
    }catch(err){
        console.log(err);
        res.status(500).json({error:'Internal Server Error'})
    }
})


router.get('/:tasteType',async(req, res)=>{
    try{
        const tasteType= req.params.tasteType; 
        if(tasteType == 'sweet' || tasteType == 'spicy' || tasteType == 'sour')
            {
                const response = await menuItem.find({taste:tasteType});
                console.log('response fetched');
                res.status(200).json(response);
            }
            else
            {
                res.status(404).json({error:'item not found'});
            }
    }catch(err){
        console.log(err);
        res.status(500).json({error:'Internal server error'});
    }
})

router.put('/:id',async(req,res)=>{
    try{
        const itemId=req.params.id;
        const updateMenuItem=req.body;

        const response=await menuItem.findByIdAndUpdate(itemId,updateMenuItem,{
            new:true,
            validator:true
        });
        
        if(!response)
        {
            return res.status(404).json({message:'Item Not found'});
        }

        console.log('data updated');
        res.status(200).json(response);
    }catch(err){
        console.log(err);
        res.status(500).json({err:'Internal server error'});
    }
})

router.delete('/:id',async(req,res)=>{
    try{
        const itemId=req.params.id;

        const response= await menuItem.findByIdAndDelete(itemId);
        if(!response)
        {
            return res.status(404).json({message:'Item not found'});
        }

        console.log('data deleted');
        res.status(200).json(response);
    }catch(err){
        console.log(err);
        res.status(500).json({err:'Internal server error'});
    }
})

//comment add for testing purpose
module.exports=router;