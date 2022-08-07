const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const route = require('./route/route')
const multer = require("multer")

const app = express()
app.use(bodyParser.json())
app.use(multer().any())
const { AppConfig } = require('aws-sdk')

//----------------------------connecting database......-----------------------
mongoose.connect("mongodb+srv://LalitaMahule:lali123456789@cluster0.ypjvt.mongodb.net/group12Database", {
    useNewUrlParser: true
})
    .then(() => console.log("mongoDB is connected"))
    .catch((error) => console.log(error))

app.use('/', route)

app.listen(process.env.PORT || 3000, function () {
    console.log("express app is running on PORT " + (process.env.PORT || 3000))
})