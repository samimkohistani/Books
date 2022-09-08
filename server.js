// DEPENDENCIES
const express = require("express");
const app = express();
require("dotenv").config();
const mongoose = require("mongoose");
const Book = require("./models/book.js");
const methodOverride = require("method-override");

// DATABASE CONFIGURATION
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Database Connection Error/Success
// Define callback functions for various events
const db = mongoose.connection
db.on('error', (err) => console.log(err.message + ' is mongo not running?'));
db.on('connected', () => console.log('mongo connected'));
db.on('disconnected', () => console.log('mongo disconnected'));

// MIDDLEWARE  & BODY PARSER
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// ROUTES

// SEED DATA - Uncomment to add seed data
// const bookSeed = require('./models/bookSeed.js');

// app.get('/books/seed', (req, res) => {
// 	Book.deleteMany({}, (error, allBooks) => {});

// 	Book.create(bookSeed, (error, data) => {
// 		res.redirect('/books');
// 	});
// });

// INDEX
app.get('/books', (req, res) => {
    Book.find({}, (error, allBooks) => {
        res.render('index.ejs', {
            books: allBooks,
        });
    });
});

// NEW
app.get("/books/new", (req, res) => {
    res.render('new.ejs')
});

// DELETE
app.delete("/books/:id", (req, res) => {
    Book.findByIdAndDelete(req.params.id, (err, data) => {
        res.redirect("/books")
    })
});

// UPDATE
app.put("/books/:id", (req, res) => {
    if (req.body.completed === "on") {
        req.body.completed = true
    } else {
        req.body.completed = false
    }

    Book.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            new: true,
        },
        (error, updatedBook) => {
            res.redirect(`/books/${req.params.id}`)
        }
    )
});

// CREATE
app.post("/books", (req, res) => {
    if (req.body.completed === 'on') {
        //if checked, req.body.completed is set to 'on'
        req.body.completed = true;
    } else {
        //if not checked, req.body.completed is undefined
        req.body.completed = false;
    }
    Book.create(req.body, (error, createdBook) => {
        res.redirect("/books");
    });
})

// EDIT
app.get("/books/:id/edit", (req, res) => {
    Book.findById(req.params.id, (error, foundBook) => {
        res.render("edit.ejs", {
            book: foundBook,
        })
    })
})

// SHOW
app.get("/books/:id", (req, res) => {
    Book.findById(req.params.id, (err, foundBook) => {
        res.render("show.ejs", { book: foundBook })
    })
})

// LISTENER
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`The serer is listening on port: ${PORT}`)
})