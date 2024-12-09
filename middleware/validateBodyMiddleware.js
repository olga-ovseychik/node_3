const movieModel = require('../models/movieModel');

function validateBodyMiddleware(req, res, next) {
    try {
        for (let key in movieModel) {
            if (!req.body.hasOwnProperty(key) && req.method !== 'PATCH') {
                throw new Error(`Missing field: '${key}'`);
            } 

            if (typeof req.body[key] !== movieModel[key] && req.body[key] !== undefined) {
                throw new Error(`Invalid type for field '${key}'. Expected '${movieModel[key]}', got '${typeof req.body[key]}'`);
            }

            if ((key == 'budget' || key == 'gross') && req.body[key] < 0 ) {
                throw new Error(`Negative values are not allowed.`);
            }

            if (key == 'position' && req.body[key] > 100 && req.data.movies.length == 100) {
                throw new Error(`'position' value is out of range. There are no more empty slots.`);
            } else if (key == 'position' && req.body[key] < 1) {
                throw new Error(`Invalid value for 'position' field.`);
            } 

            if (key == 'rating' && Number(req.body[key]) > 10) {
                throw new Error(`'rating' value is out of range. Expected from 1.0 to 10.0`);
            }

            if (key == 'year' && (req.body[key] < 1895  || req.body[key] > 2024)) {
                throw new Error(`Invalid value for 'year' field.`);
            }

            const regex = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,6}(\/[^\s]*)?\.(jpg|jpeg|png|gif|bmp|webp|svg)$/i;
            if (key == 'poster' && !regex.test(req.body[key]) && req.body[key] !== undefined) {
                throw new Error(`Invalid value for 'poster' field.`);
            }
        } 

        next();
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
}

module.exports = validateBodyMiddleware;