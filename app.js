// Imports
const express = require("express");
const app = express();
const PORT = 3003;
const mustache = require("mustache-express")
const bodyParser = require("body-parser");
// Executes the function that is returned and stores the value in pgp
const pgp = require("pg-promise")();
const session = require("express-session");
const path = require("path");
const userRoutes = require("./routes/users");
const indexRoutes = require("./routes/index");


// Setup
const CONN_STR = "postgres://localhost:5432/newsdb";
const VIEWS_PATH = path.join(__dirname, "/views")
// Craetes db object using the connection string
db = pgp(CONN_STR);
// Tells body parser what body we're looking for
app.use(bodyParser.urlencoded({ extended: false }));
// Setup routes middleware
app.use("/", indexRoutes);
app.use("/users", userRoutes);
// Configures view engine
app.engine("mustache", mustache(VIEWS_PATH + "/partials", ".mustache"));
app.set("views", VIEWS_PATH);
app.set("view engine", "mustache");
// Adds first param to apply alias since otherwise .css files would be available at root level (localhost:3003/example.css)
app.use("/css", express.static("css"))
// Configures session
app.use(session({
    secret: "rwg4gdsvzvz",
    resave: "",
    // Save session only when we put something in it
    saveUninitialized: false
}))




// Start
app.listen(PORT, () => {
    console.log(`Server started on port: ${PORT}`)
});  