// Imports
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { application } = require("express");




// Setup
const SALT_ROUNDS = 10;



// Start
/*
router.get("/", (req, res) => {
    db.any("SELECT articleid, title, body FROM articles")
        .then((articles) => {
            res.render("index", { articles: articles });
        }).catch((error) =>
            console.log(error));
})
*/
// Async await version of previous function
router.get("/", async (req, res) => {
    let articles = await db.any("SELECT articleid, title, body FROM articles");
    res.render("index", { articles: articles });      
});


router.get("/register", (req, res) => {
    res.render("register");
});

router.get("/login", (req, res) => {
    res.render("login");
});


router.post("/login", (req, res) => {   
    let username = req.body.username;
    let password = req.body.password;    
    db.oneOrNone("SELECT userid, username, password FROM users WHERE username = $1", [username])
        .then((user) => {
            if (user) {
                bcrypt.compare(password, user.password, (error, result) => {
                    // Checks if the passwords match
                    if (result) {
                        if (req.session) {                            
                            req.session.user = { userid: user.userid, username: user.username }
                        }
                        res.redirect("/users/articles");
                    } else {
                        res.render("login", { message: "Invalid username or password." });
                    }
                });
            } else {
                res.render("login", { message: "Invalid username or password." });
            }
        })

});

router.post("/register", (req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    db.oneOrNone(`SELECT userid FROM users WHERE username = $1`, [username]
    ).then((user => {
        // Checks if user does exist
        if (user) {
            res.render("register", { message: "Username already exists" })
        } else {
            // Inserts user into user table            
            bcrypt.hash(password, SALT_ROUNDS, (error, hash) => {
                // Do not use stritct comparison === or it will go into else block
                if (error == null) {
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


router.get("/logout", (req, res, next) => {
    if(req.session){
        req.session.destroy((error) => {
            if(error){
                next(error);
            } else {
                res.redirect("/login");
            }
        })
    }
});


module.exports = router;