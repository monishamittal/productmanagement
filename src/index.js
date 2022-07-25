const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const route = require('./route/route')

const app = express()
app.use(bodyParser.json())

mongoose.connect("mongodb+srv://musharrafansari:XY5t9CKinqT75evR@cluster0.xsylin5.mongodb.net/group40Database", {
    useNewUrlParser: true
})
    .then(() => console.log("mongoDB is connected"))
    .catch((error) => console.log(error))

app.use('/', route)

app.listen(process.env.PORT || 3000, function () {
    console.log("express app is running on PORT " + (process.env.PORT || 3000))
})