const mws = require('./mywebsocket');
require('./discord.js');
require('./twitch.js');
const path = require("path");

const express = require("express");
const app = express(); // create express app

// add middleware
app.use(express.static("public"));

// start express server on port 5000
app.listen(5000, () => {
    console.log("server started on port 5000");
});

app.use(express.static(path.join(__dirname, "..", "build")));
app.use(express.static("public"));
