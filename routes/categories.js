const router = require('express').Router();
const Category = require('../models/Category');

router.post('/', async (req, res) => {
    const newCategory = new Category(req.body);
    try {
        const newCategorySaved = await newCategory.save();
        res.status(201).json(newCategorySaved); // Changed status to 201 Created
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
