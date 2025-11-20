const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
    //write code to check is the username is valid
}

const authenticatedUser = (username, password) => { //returns boolean
    let validUsers = users.filter((user) => {
        return (user.username === username && user.password === password)
    });
    if (validUsers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    //check if username and password is missing
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }

    //authenticate user 
    if (authenticatedUser(username, password)) {

        //generate token 
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });

        //store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send(`User ${username} successfully logged in`);
    } else {
        return res.status(401).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;

    if (!req.session.authorization || !req.session.authorization.username) {
        return res.status(401).json({ message: "User not logged in" });
    }

    const username = req.session.authorization.username;

    if(!books[isbn]) {
        return res.status(404).json({message: "Book not found"})
    }

    if(!books[isbn].reviews){
        books[isbn].reviews = {};
    }

    books[isbn].reviews[username] = review;

    return res.status(200).json({ message: "Review added" });
});

//delete a review of a book
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.isbn;

    const username = req.session.authorization.username;

    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }
    
    if (!books[isbn].reviews || !books[isbn].reviews[username]) {
        return res.status(404).json({ message: "Review not found for this user" });
    }
    
    delete books[isbn].reviews[username];

    res.status(200).json({message:"Review deleted"})
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
