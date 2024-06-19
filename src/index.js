require('dotenv').config();
const express = require('express');
require('./db/mongoose.js');
cors = require('cors');
const userRouter = require('./routers/user.js');
const movieRouter = require('./routers/movie.js');


const app = express();

const port = process.env.PORT;


app.use(express.static("public")) 
app.use(cors());
app.use(express.json());
app.use(userRouter);
app.use(movieRouter);

app.get('/', (req, res) => {
  res.send('Welcome to the Movie API');

})

app.listen(port, () => {
  console.log(`App listening on port ${port}`)});