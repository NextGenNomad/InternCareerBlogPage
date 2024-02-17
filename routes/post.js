const router = require('express').Router();
const passport = require('passport');
const Post = require('../models/Post');

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
  
    return res.redirect('/signin');
};

// Route to render the post creation form
router.get('/', isAuthenticated, (req, res) => {
    // Render the post creation form
    res.render('create-post', { title: 'Create Post' });
});

// Route to handle post creation
router.post('/', isAuthenticated, async (req, res) => {
    const username = req.user.username;

    const newPost = new Post({
        title: req.body.title,
        desc: req.body.message,
        photo: req.body.post__img, 
        username: req.user.username, 
        categories: [req.body.category] 
    });

    try {
        // Save the new post to the database
        const savedPost = await newPost.save();
        res.status(200).json(savedPost);
    } catch (err) {
        // Handle errors
        res.status(500).json({ message: 'Failed to create post', error: err });
    }
});


//UPDATE POST
router.put('/:id', async (req, res) =>{
    try{
        const post = await Post.findById(req.params.id)
       if(post.username === req.body.username){
        const updatePost = await Post.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            },{new:true}
        )
        res.status(200).json(updatePost)
       }else {
        res.status(401).json('You can only update your post!')
       }
    }catch(err){
        res.status(500).json(err)
    }

})


router.delete('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json('Post not found');
        }

        if (post.username === req.body.username) {
            try {  
                await Post.deleteOne({ _id: req.params.id });
                console.log('Post deleted successfully');
                res.status(200).json('Post has been deleted successfully');
            } catch(err) {
                console.error('Error deleting post:', err);
                res.status(500).json(err);
            }
        } else {
            res.status(401).json('You can only delete your own posts');
        }
    } catch(err) {
        console.error('Error finding post:', err);
        res.status(500).json(err);
    }
});


router.get('/:id', async (req, res) =>{
    try{ 
        const post  = await Post.findById(req.params.id)
        const {password, ...anything} = post._doc
        res.status(200).json(anything)
    }catch(err){
        res.status(500).json(err)
    }
})


module.exports = router