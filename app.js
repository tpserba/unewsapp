// Imports
const express = require("express");
const app = express();
const PORT = 3003;
const mustache = require("mustache-express")

//Setup
app.engine("mustache", mustache());
app.set("views","./views");
app.set("view engine", "mustache");


//Start
app.get("/register", (req, res) => {
    res.render("register");
});


app.listen(PORT, () => {
    console.log(`Server started on port: ${PORT}`)
});  