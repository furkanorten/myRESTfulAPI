const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/restful_api')
    .then(() => console.log("Connected to DB"))
    .catch(error => console.log("Cannot connected to DB: " + error))