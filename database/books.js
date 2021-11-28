const mongoose = require("mongoose");

//create book schema

const BookSchema = mongoose.Schema({
   
    ISBN: String,
    title: String,
    authors: [Number], //arrays of nos. that is why square box also
    language: String,
    pubDate: String,
    numOfPage: Number,
    category: [String], //arrays of string that is why square bracket
    publication: Number 
});

const BookModel = mongoose.model("books" , BookSchema); //books= mongodb collection from atlas ... // give booksmodel following the above schema

module.exports = BookModel;