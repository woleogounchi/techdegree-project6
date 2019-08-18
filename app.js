// Require express
const express = require('express');

// Get the data fron the data.json file
const data = require('./data.json');
const projects = data.projects;

// Use express in the app
const app = express();

// Set our view engine to pug
app.set('view engine', 'pug');

// Serve the static files located in the public folder
app.use('/static', express.static('public'));

// Setting our toutes
// An index route to render the home page 
app.get('/', (req, res) => {
    res.render('index', {projects});
});
app.locals = data.projects;

// An about route to render the about page
app.get('/about', (req, res) => {
    res.render('about');
});

// A dynamic "project" routes based on the id of the project
// that render a customized version of the Pug project template 
// to show off each project
app.get('/project/:id', (req, res, next) => {
    const { id } = req.params;

    // If a user navigates to a non-existent route, return next()
    if (id >= projects.length || isNaN(id)) {
        res.locals.error = {
            message: "The project you are looking for is not found",
            status: 404,
            stack: "Please go to another page"
        };
        res.render('error');
    }
    // Variables to hold the data
    const project = projects[id];

    // Render the data related to a project
    res.render('project', {project});
    next();
});

// Handle 404 error
app.use((req, res, next) => {
    const err = new Error("Not Found");
    err.status = 404;
    next(err);
});

// Display the error page with the error information
app.use((err, req, res, next) => {
    res.locals.error = err;
    res.status(err.status);
    res.render('error');
    // Log out a user friendly error message to the console when the app is pointed at a non-existent route
    console.log("Sorry the requested page can not be found.")
});

// App listen to port 3000
app.listen(3000, () => {
    console.log('The application is running on localhost:3000!');
});