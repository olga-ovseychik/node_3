const express = require('express');
const router = require('./routes/postRoutes');

const PORT = 3000;
const app = express();

app.use(express.json()); 

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use("/api/films/", router);

app.use((req, res, next) => {
    const error = new Error('Not Found.');
    error.status = 404;
    next(error);
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({ 
        error: { message: err.message } 
    });
});

app.listen(PORT, '127.0.0.1', () => {
    console.log(`Server has started on port ${PORT}.`);
});