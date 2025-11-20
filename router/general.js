const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(300).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;  
  return res.status(300).json(books[isbn]);
 });
  
// Get book details based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title.toLowerCase();
    const matchingBooks = {};

    // iterate through books
    for (let key in books) {
        if (books[key].title.toLowerCase() === title) {
            matchingBooks[key] = books[key];
        }
    }

    if (Object.keys(matchingBooks).length > 0) {
        return res.status(200).json(matchingBooks); 
    } else {
        return res.status(404).json({ message: `No books found for title: ${req.params.author}` });
    }
});


// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title.toLowerCase();
    const matchingBooks = {};

    // iterate through books
    for (let key in books) {
        if (books[key].title.toLowerCase() === title) {
            matchingBooks[key] = books[key];
        }
    }

    if (Object.keys(matchingBooks).length > 0) {
        return res.status(200).json(matchingBooks); 
    } else {
        return res.status(404).json({ message: `No books found for title: ${req.params.title}` });
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;

    if (books[isbn]){
        const reviews = books[isbn].reviews;
        return res.status(200).json(reviews);
    } else {
        res.status(404).json({message: "book not found"})
    }
});

module.exports.general = public_users;
