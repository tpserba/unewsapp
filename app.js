// Imports
const express = require("express");
const app = express();
const PORT = 3003;
const mustache = require("mustache-express")
const bodyParser = require("body-parser");
//Setup
app.engine("mustache", mustache());
app.set("views","./views");
app.set("view engine", "mustache");
// Tells body parser what body we're looking for
app.use(bodyParser.urlencoded({extended:false}));


//Start
app.get("/register", (req, res) => {
    res.render("register");
});

app.post("/register", (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    console.log(username);
    console.log(password);
    res.send("REGISTER")
});

app.listen(PORT, () => {
    console.log(`Server started on port: ${PORT}`)
});  