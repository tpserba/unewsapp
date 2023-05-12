// Imports
const express = require("express");
const app = express();
const PORT = 3003;
const mustache = require("mustache-express")
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
// Executes the function that is returned and stores the value in pgp
const pgp = require("pg-promise")();


//Setup
const CONN_STR = "postgres://localhost:5432/newsdb";
// Craetes db object using the connection string
const db = pgp(CONN_STR);
app.engine("mustache", mustache());
app.set("views", "./views");
app.set("view engine", "mustache");
// Tells body parser what body we're looking for
app.use(bodyParser.urlencoded({ extended: false }));
const SALT_ROUNDS = 10;


//Start
app.get("/register", (req, res) => {
    res.render("register");
});

app.get("/login", (req, res) => {
    res.render("login");
});


app.post("/login", (req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    db.oneOrNone("SELECT userid, username, password FROM users WHERE username = $1", [username])
        .then((user) => {
            console.log(user);
            if (user) {
                bcrypt.compare(password, user.password, (error, result) => {
                    if (result) {
                        res.send("SUCCESS")
                    } else {
                        res.render("login", { message: "Invalid username or password." });
                    }
                });
            } else {
                res.render("login", { message: "Invalid username or password." });
            }
        })

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
            console.log(password);
            console.log(SALT_ROUNDS);
            bcrypt.hash(password, SALT_ROUNDS, (error, hash) => {
                // Do not use stritct comparison === or it will go into else block
                if (error == null) {
                    console.log("no error")
                    db.none("INSERT INTO users(username, password) VALUES($1, $2)", [username, hash])
                        .then(() => {
                            res.send("SUCCESS")
                        })
                } else {
                    console.log(error);
                }
            })
        }
    })).catch(error => {
        console.log(error);
    })
});

app.listen(PORT, () => {
    console.log(`Server started on port: ${PORT}`)
});  