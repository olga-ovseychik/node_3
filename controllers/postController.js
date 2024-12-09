const { v4 } = require('uuid');
const { writeFile } = require('fs/promises');
const handleGaps = require('../helper');


const getMovies = (req, res) => {
	try {
        res.status(200).send(req.data.movies);
	} catch (error) {
		console.error(error);
		res.status(500).send({ error: error.message });
	}
}

const getMovie = (req, res) => {
	try {
        const { id } = req.params;
        const movie = req.data.movies.find((item) => item.id === id);

        if (!movie) {
            return res.status(404).send({ error: `Movie with id: ${id} not found.` });
        }
        
        res.status(200).send(movie);
	} catch (error) {
		console.error(error);
		res.status(404).send({ error: error.message });
	}
}

const createMovieItem = async (req, res) => {
    try {
        const { title, rating, year, budget, gross, poster, position } = req.body;

        const newItem = {
            id: v4(),
            title: title,
            rating: rating,
            year: year,
            budget: budget,
            gross: gross,
            poster: poster,
            position: position
        };

        const updatedPositionItem = handleGaps(req.data.movies, position, newItem);

        const updatedJson = JSON.stringify({ movies: req.data.movies }, null, 2);

        await writeFile('./data.json', updatedJson, 'utf-8');

        res.status(201).send(!updatedPositionItem ? newItem : updatedPositionItem);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }    
}

const updateMovieItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, rating, year, budget, gross, poster, position } = req.body;      
        const index = req.data.movies.findIndex((item) => item.id === id);

        if (index === -1) {
            return res.status(404).send({ error: `Movie with id: ${id} not found.` });
        }

        let updatedPositionItem = null;
        let [ updatedMovieItem ] = req.data.movies.splice(index, 1);

        updatedMovieItem = {
            id: updatedMovieItem?.id,
            title: title || updatedMovieItem?.title,
            rating: rating || updatedMovieItem?.rating,
            year: year || updatedMovieItem?.year,
            budget: budget || updatedMovieItem?.budget,
            gross: gross || updatedMovieItem?.gross,
            poster: poster || updatedMovieItem?.poster
        }

        if (position !== updatedMovieItem.position) {
            updatedPositionItem = handleGaps(req.data.movies, position, updatedMovieItem, true);
        
            req.data.movies.forEach((item, idx) => {
                item.position = idx += 1;
            });
        }  else {
            req.data.movies.splice(index, 0, updatedMovieItem);
        }    

        const updatedJson = JSON.stringify({ movies: req.data.movies }, null, 2);

        await writeFile('./data.json', updatedJson, 'utf-8');

        res.status(200).send(!updatedPositionItem ? updatedMovieItem : updatedPositionItem);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
}

const deleteMovieItem = async (req, res) => {
    try {
        const { id } = req.params;
        const index = req.data.movies.findIndex((item) => item.id === id);

        if (index === -1) {
            return res.status(404).send({ error: `Movie with id: ${id} not found.` });
        }
    
        req.data.movies.splice(index, 1);
    
        req.data.movies.forEach((item, idx) => {
            item.position = idx += 1;
        });
    
        const updatedJson = JSON.stringify({movies:  req.data.movies}, null, 2);
    
        await writeFile('./data.json', updatedJson, 'utf-8');
    
        res.status(200).send(`Movie with ${id} was successfully deleted.`);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
}

module.exports = { 
    getMovies, 
    getMovie,
    createMovieItem,
    updateMovieItem,
    deleteMovieItem 
};