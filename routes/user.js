const express = require('express')
const router = express.Router()
const User = require('../models/User')
const Post = require('../models/Post')
const bcrypt = require('bcrypt')

//UPDATE USER DETAILS
router.put('/:id', async (req, res) =>{
    if(req.body.userId === req.params.id){
  
        if(req.body.password){
            req.body.password = await bcrypt.hash(req.body.password, 10)
        }
        try{
            const updatedUser = await User.findByIdAndUpdate(req.params.id,{
                $set: req.body,
            },{new:true})
            res.status(200).json(updatedUser)
        }catch (err){
            res.status(500).json(err)
        }
    }else {
        res.status(401).json('You can only update your credintials!')
    }
})

//DELETE USER DETAILS
router.delete('/:username', async (req, res) => {
    if (req.body.userId === req.params.username) {
        try {
            const user = await User.findOne({ username: req.params.username });
            if (user) {
                try {
                    await Post.deleteMany({ username: user.username });
                    await User.findByIdAndDelete(user._id);
                    res.status(200).json('User successfully deleted...');
                } catch (err) {
                    res.status(500).json(err);
                }
            } else {
                res.status(404).json('User not found');
            }
        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        res.status(401).json('You can only delete your credentials!');
    }
});



//GET USER

router.get('/:id', async (req, res) =>{
    try{ 
        const user  = await User.findById(req.params.id)
        const {password, ...anything} = user._doc
        res.status(200).json(anything)
    }catch(err){
        res.status(500).json(err)
    }
})

module.exports = router