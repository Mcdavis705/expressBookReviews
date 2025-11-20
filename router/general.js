const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


// Check if a user with the given username already exists
const doesExist = (username) => {
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

//register user endpoint
public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    //check if username and password are provided
    if(username && password){
        //check if username doesnt already exist 
        if(!doesExist(username)){
            users.push({"username":username, "password":password});
            return res.status(200).json({message: "User " + username+ " is registered"})
        }
    } else {
        return res.status(400).json({message:"Username and password are required"});
    }

});

// Get the book list available in the shop
public_users.get('/',async (req, res) => {
    try{
        const bookList = await new Promise ((resolve, reject)=> {
            if(books) resolve (books);
            else reject ("No books available");
        });
        res.status(200).json(bookList);
    } catch(err){
        res.status(500).json({message:"Unable to fetch books"});
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;  

  new Promise ((resolve, reject)=> {
    if(books[isbn]){
        resolve(books[isbn]);
    } else {
        reject("Book not found")
    }
  })
    .then(book => res.status(200).json(book))
    .catch(err => res.status(404).json({ message: err }));
 });
  
// Get book details based on author
public_users.get('/author/:author', (req, res) => {
    const author = req.params.author.toLowerCase();

    new Promise((resolve, reject) => {
        const matchingBooks = {};

        // iterate through books
        for (let key in books) {
            if (books[key].author.toLowerCase() === author) {
                matchingBooks[key] = books[key];
            }
        }

        if (Object.keys(matchingBooks).length > 0) {
            resolve(matchingBooks);
        } else {
            reject(`No books found for author: ${req.params.author}`);
        }
    })
    .then(result => res.status(200).json(result))
    .catch(err => res.status(404).json({ message: err }));
});




// Get book details based on title
public_users.get('/title/:title', (req, res) => {
    const title = req.params.title.toLowerCase();

    new Promise((resolve, reject) => {
        const matchingBooks = {};

        // iterate through books
        for (let key in books) {
            if (books[key].title.toLowerCase() === title) {
                matchingBooks[key] = books[key];
            }
        }

        if (Object.keys(matchingBooks).length > 0) {
            resolve(matchingBooks);
        } else {
            reject(`No books found for title: ${req.params.title}`);
        }
    })
    .then(result => res.status(200).json(result))
    .catch(err => res.status(404).json({ message: err }));
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
