// Imports
const express = require("express");
const router = express.Router();



// Setup



// Start
router.get("/articles", (req, res) => {
   
   let userid = req.session.user.userid;
    
    db.any("SELECT articleid, title, body FROM articles WHERE fk_userid = $1", [userid])
        .then((articles) => {
            res.render("articles", { articles: articles });
        }).catch(error => {
            console.log(error);
        })

});



router.get("/add-article", (req, res) => {
    res.render("add-article");
});

router.post("/add-article", (req, res) => {
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
});

router.post("/delete-article", (req, res) => {
    let articleid = req.body.articleid;
    db.none("DELETE FROM articles WHERE articleid = $1", [articleid])
        .then(() => {
            res.redirect("/users/articles");
        }).catch(error => {
            console.log(error);
        });
});



router.post("/update-article", (req, res) => {
    let title = req.body.title;
    let body = req.body.body;
    let articleid = req.body.articleid;
    db.none("UPDATE articles SET title = $1, body = $2 WHERE articleid = $3", [title, body, articleid])
        .then(() => {
            res.redirect("/users/articles");
        }).catch(error => {
            console.log(error);
        });
});


router.get("/articles/edit/:articleid", (req, res) => {
    let articleid = req.params.articleid;
    db.one("SELECT articleid,title, body FROM articles WHERE articleid = $1", [articleid])
        .then(article => {
            res.render("edit-article", article);
        }).catch(error => {
            console.log(error);
        })
});



module.exports = router;