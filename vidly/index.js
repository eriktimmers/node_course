const express = require('express');
const app = express();
const genreRouter = require('./routes/genres');

// middleware
app.use(express.json());

// routers
app.use('/api/genres', genreRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}...`));
