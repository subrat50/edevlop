require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const route=require("../src/routes/route.js");
const cors=require('cors');

let app = express();

app.use(bodyParser.json());
app.use (cors());
mongoose.connect("mongodb+srv://subrat_400:4iQC1DP0ZqKInrD3@cluster0.h3xeivd.mongodb.net/e-devlop",{
    useNewUrlParser: true,
   useUnifiedTopology: true,
}).then(() => {
    console.log("Connected to MongoDB");
}).catch((err)=>{
    console.log(err.message)
})
app.use("/",route);
let port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    
})
