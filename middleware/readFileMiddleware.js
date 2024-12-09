const fs = require('node:fs');


function readFileMiddleware(req, res, next) {
    let data = '';
    const stream = fs.createReadStream('./data.json', { encoding: 'utf8' });

    stream.on('data', (chunk) => {
        data += chunk;
    });

    stream.on('end', () => {  
        try {
            req.data = JSON.parse(data);
        } catch (er) {
            res.status(400).send(`error: ${er.message}`);
        }
        
        next();
    });

    stream.on('error', (er) => {
        res.status(500).send(`error: ${er.message}`);
    });
}

module.exports = readFileMiddleware;