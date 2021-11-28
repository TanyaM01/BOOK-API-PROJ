const mongoose = require("mongoose");

//create Author schema

const AuthorSchema = mongoose.Schema({
   
    id: Number,
    name: String,
    books: [String] 
});

const AuthorModel = mongoose.model("authors" , AuthorSchema); //books= mongodb collection from atlas ... // give booksmodel following the above schema

module.exports = AuthorModel;