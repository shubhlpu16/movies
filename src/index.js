require('dotenv').config();
const express = require('express');
require('./db/mongoose.js');
cors = require('cors');
const userRouter = require('./routers/user.js');
const movieRouter = require('./routers/movie.js');


const app = express();

const port = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(userRouter);
app.use(movieRouter);

app.listen(port, () => {
  console.log(`App listening on port ${port}`)});