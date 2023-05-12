// Imports
const express = require("express");
const app = express();
const PORT = 3003;
const mustache = require("mustache-express")
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
// Executes the function that is returned and stores the value in pgp
const pgp = require("pg-promise")();
const session = require("express-session");
const path = require("path");



//Setup
const CONN_STR = "postgres://localhost:5432/newsdb";
const VIEWS_PATH = path.join(__dirname, "/views")
// Craetes db object using the connection string
const db = pgp(CONN_STR);
app.engine("mustache", mustache(VIEWS_PATH + "/partials", ".mustache"));
app.set("views", VIEWS_PATH);
app.set("view engine", "mustache");
// Tells body parser what body we're looking for
app.use(bodyParser.urlencoded({ extended: false }));
const SALT_ROUNDS = 10;
app.use(session({
    secret: "rwg4gdsvzvz",
    resave: "",
    // Save session only when we put something in it
    saveUninitialized: false
}))



//Start
app.get("/register", (req, res) => {
    res.render("register");
});

app.get("/login", (req, res) => {
    res.render("login");
});


app.get("/users/articles", (req, res) => {
    // Uncomment, commented to speed up things (have to login each time to retrieve articles otherwise)
    //let userid = req.session.user.userid;
    // Remove when done
    let userid = 4;
    db.any("SELECT articleid, title, body FROM articles WHERE fk_userid = $1", [userid])
    .then((articles)=> {
        res.render("articles", {articles: articles});
    }).catch(error => {
        console.log(error);
    })
    
});



app.get("/users/add-article", (req, res) => {
    res.render("add-article");
})


app.get("/users/articles/edit/:articleid",(req, res)=> {
let articleid = req.params.articleid;
db.one("SELECT articleid,title, body FROM articles WHERE articleid = $1", [articleid])
.then(article => {
    res.render("edit-article",article);    
}).catch(error => {
    console.log(error);
})
});


app.post("/users/update-article", (req, res) => {
    let title = req.body.title;
    let body = req.body.body;
    let articleid = req.body.articleid;
    db.none("UPDATE articles SET title = $1, body = $2 WHERE articleid = $3", [title, body, articleid])
    .then(()=> {
        res.redirect("/users/articles");
    }).catch(error => {
        console.log(error);
    });
});

app.post("/users/add-article", (req, res) => {
    let title = req.body.title;
    let description = req.body.description;
    // Each article belongs to a user, so it gathers the userid
    let userid = req.session.user.userid;
    db.none("INSERT INTO articles(title, body, fk_userid) VALUES($1, $2, $3)", [title, description, userid])
        .then(() => {
            res.send("SUCCESS");
        }).catch(error => {
            console.log(error);
        });
})

app.post("/login", (req, res) => {
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

app.listen(PORT, () => {
    console.log(`Server started on port: ${PORT}`)
});  