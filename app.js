// Imports
const express = require("express");
const app = express();
const PORT = 3003;
const mustache = require("mustache-express")
const bodyParser = require("body-parser");
// Executes the function that is returned and stores the value in pgp
const pgp = require("pg-promise")();
const CONN_STR = "postgres://localhost:5432/newsdb";
// Craetes db object using the connection string
const db = pgp(CONN_STR);

//Setup
app.engine("mustache", mustache());
app.set("views", "./views");
app.set("view engine", "mustache");
// Tells body parser what body we're looking for
app.use(bodyParser.urlencoded({ extended: false }));


//Start
app.get("/register", (req, res) => {
    res.render("register");
});

app.post("/register", (req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    db.oneOrNone(`SELECT userid FROM users WHERE username = $1`, [username]
    ).then((user => {
        // Checks if user does exist
        if (user) {
            res.render("register", { message: "Username already exists" })
        } else {
            // Inserts user into user table
            db.none("INSERT INTO users (username, password) VALUES($1, $2)", [username, password])
                .then((() => {
                    res.send("SUCCESS")
                })).catch((error) => {
                    console.log(error)
                })
        }
    }))
});

app.listen(PORT, () => {
    console.log(`Server started on port: ${PORT}`)
});  