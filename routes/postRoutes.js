const express = require('express');
const { 
    getMovies, 
    getMovie, 
    createMovieItem, 
    updateMovieItem, 
    deleteMovieItem } = require("../controllers/postController.js");
const readFileMiddleware = require('../middleware/readFileMiddleware.js');
const validateBodyMiddleware = require('../middleware/validateBodyMiddleware.js');

const router = express.Router();

router.use(readFileMiddleware);

router.get("/readall", getMovies);
router.get("/read/:id", getMovie);
router.post("/create", validateBodyMiddleware, createMovieItem);
router.patch("/update/:id", validateBodyMiddleware, updateMovieItem);
router.delete("/delete/:id", deleteMovieItem);

module.exports = router;