function checkAuth(req, res, next) {
    console.log(req.body);
    console.log(req.session);
    if(req.session) {
        if(req.session.user) {
            next();
        } else {
            res.redirect("/login");
        }
    } else {
        // Redirects to login if session has not been created, since user has not logged in
        res.redirect("/login");
    }
}


module.exports = checkAuth;