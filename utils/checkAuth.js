function checkAuth(req, res, next) {    
    if(req.session) {
        if(req.session.user) {
            res.locals.authenticated = true;
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