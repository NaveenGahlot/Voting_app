const express = require("express");
const mongoose = require("mongoose");
const userRoute = require("./routes/userRoutes");
const candidateRoutes = require("./routes/CandidateRoutes");
const dotenv = require("dotenv");

const app = express();

dotenv.config();
app.use(express.json());
const bodyParser = require('body-parser'); 
app.use(bodyParser.json()); // req.body

const PORT = process.env.PORT;
const URL = process.env.mongoURl; 
// const URL = 'mongodb://127.0.0.1:27017/voting_app';

// Connect to mongoDB
main().then(()=>{
    console.log("connected to DB");
}).catch((err)=>{
    console.log(err);
})
async function main(){
    await mongoose.connect(URL);
}

app.get('/jaipur', (req, res) => {
  res.send('Hello Jaipur!')
})

// define route 
app.use('/user',  userRoute); 
app.use('/candidate', candidateRoutes); 

app.listen(PORT, () => {
    console.log(`app listening on port ${PORT}`);
});

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5YmI2NTBlOGRmODUzNmU2ZGNjYTZmZSIsImlhdCI6MTc3Mzg4ODc4MywiZXhwIjoxNzc0MDU3OTgzfQ.LbCqs4aqQHSWgVK899g_A4vel91lBj9rc608FoF9k78