// MAIN BACKEND FILE

const db = require("./database");

const BookModel = require("./database/books");
const AuthorModel = require("./database/authors");
const PublicationModel = require("./database/publications");

const express = require("express");
const app = express();
app.use(express.json());

//Import the mongoose module

 var mongoose = require( 'mongoose');
 //set up default mongoose connection
 var mongoDB = 'mongodb://tanya_maurya:YG9PStFwTQLyGBjp@cluster0-shard-00-00.afnrm.mongodb.net:27017,cluster0-shard-00-01.afnrm.mongodb.net:27017,cluster0-shard-00-02.afnrm.mongodb.net:27017/book-company?ssl=true&replicaSet=atlas-ayl6gt-shard-0&authSource=admin&retryWrites=true&w=majority';
 mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true}).then(()=>console.log("CONNECTION ESTABLISHED")).catch((e)=>console.log(e));

// http://localhost:3000/
app.get("/", (req, res) => {
    return res.json({"WELCOME": `to my Backend Software for the Book Company`});
});

// http://localhost:3000/books
app.get("/books", async (req, res) => {
    const getAllBooks = await BookModel.find();  //find=find_all
    return res.json(getAllBooks);
});

// http://localhost:3000/book-isbn/12345Three
app.get("/book-isbn/:isbn",async (req, res) => {
    // console.log(req.params);
    const {isbn} = req.params;
    // console.log(isbn);
    const getSpecificBook = await BookModel.findOne({ISBN: isbn});
    // console.log(getSpecificBook);
    // console.log(getSpecificBook.length);
    if(getSpecificBook===null) {
        return res.json({"error": `No Book found for the ISBN of ${isbn}`});
    }
    return res.json(getSpecificBook);
});

// http://localhost:3000/book-category/programming
app.get("/book-category/:category", async (req, res) => {
    // // console.log(req.params);
    const {category} = req.params;
    // // console.log(isbn);
    const getSpecificBooks = await BookModel.find({category : category}); //here, find will return array so .length is correct
    // // console.log(getSpecificBook);
    // // console.log(getSpecificBook.length);
    if(getSpecificBooks.length===0) {
        return res.json({"error": `No Books found for the category of ${category}`});
    }
    return res.json(getSpecificBooks);
});

// http://localhost:3000/authors
app.get("/authors", async (req, res) => {
    const getAllAuthors = await AuthorModel.find();
    return res.json(getAllAuthors);
});

// http://localhost:3000/author-id/1
app.get("/author-id/:id", async (req, res) => {
    // console.log(req.params);
    const {id} = req.params;
    // console.log(id);
    const getSpecificAuthor = await AuthorModel.findOne({id: id});
    // console.log(getSpecificAuthor);
    // console.log(getSpecificAuthor.length);
    if(getSpecificAuthor===null) {
        return res.json({"error": `No Author found for the id of ${id}`});
    }
    return res.json(getSpecificAuthor);
});

// http://localhost:3000/author-isbn/1One
app.get("/author-isbn/:isbn", async (req, res) => {
   // console.log(req.params);
   const {isbn} = req.params;
   // console.log(id);
   const getSpecificAuthor = await AuthorModel.find({books: isbn});
   // console.log(getSpecificAuthor);
   // console.log(getSpecificAuthor.length);
   if(getSpecificAuthor===0) {
       return res.json({"error": `No Author found for the book of ${isbn}`});
   }
   return res.json(getSpecificAuthor);
});

 // http://localhost:3000/publications
app.get("/authors", async (req, res) => {
    const getAllPublications = await PublicationModel.find();
    return res.json(getAllPublications);
});

// http://localhost:3000/publication-isbn/12345Two
app.get("/publication-isbn/:isbn", (req, res) => {
    const {isbn} = req.params;
    const getSpecificPublications = db.publications.filter((publication) => publication.books.includes(isbn));
    if(getSpecificPublications.length===0) {
        return res.json({"error": `No Publications found for the isbn of ${isbn}`});
    }
    return res.json(getSpecificPublications);
   
});



// http://localhost:3000/book
app.post("/book", async (req, res) => {
    // console.log(req.body);
    const addNewBooK = await BookModel.create(req.body);
    return res.json({
        books : addNewBooK,
        message : "BooK was added !!!"
    });
});

// http://localhost:3000/author
app.post("/author", async (req, res) => {
    // console.log(req.body);
    const addNewAuthor = await AuthorModel.create(req.body);
    return res.json({
        books : addNewAuthor,
        message : "Author was added !!!"
    });
});

// http://localhost:3000/publication
app.post("/publication", (req, res) => {
});


// http://localhost:3000/book-update/123two
app.put("/book-update/:isbn", async (req, res) => {
    // console.log(req.body);
    // console.log(req.params);
    const {isbn} = req.params;
    const updateBook = await BookModel.findOneAndUpdate({ISBN : isbn}, req.body, {new  : true});
    return res.json({
        bookUpdated: updateBook, 
        message: "Book was updated! ! !"
    });
});
 
// http://localhost:3000/author-update/2
app.put("/author-update/:id", async (req, res) => {
    // console.log(req.body);
    // console.log(req.params);
    const {id} = req.params;
    const updateAuthor = await AuthorModel.findOneAndUpdate({id : id}, req.body, {new  : true});
    return res.json({
        authorUpdated: updateAuthor, 
        message: "Author was updated! ! !"
    });
});


// http://localhost:3000/publication-update/1

// http://localhost:3000/book-delete/123two
app.delete("/book-delete/:isbn", async(req, res) => {
    // console.log(req.params);
    const {isbn} = req.params;
    const deleteBook = await BookModel.deleteOne({ISBN : isbn});
    return res.json({bookDeleted: deleteBook, message: "Book was deleted!!!"});
});

// http://localhost:3000/book-author-delete/1One/1
app.delete("/book-author-delete/:isbn/:id", async (req, res) => {
    // console.log(req.params);
    const {isbn, id} = req.params;
    let getSpecificBook = await BookModel.findOne({ISBN: isbn});
    if(getSpecificBook===null) {
        return res.json({"error": `No Book found for the ISBN of ${isbn}`});
    }
    else{
        getSpecificBook.authors.remove(id);
        const updateBook = await BookModel.findOneAndUpdate({ISBN : isbn} , getSpecificBook, {new:true});
        return res.json({bookUpdated: updateBook, message: "Author was deleted from the book!"});
    }
    
});

// http://localhost:3000/author-book-delete/1/12345ONE
app.delete("/author-book-delete/:id/:isbn", (req, res) => {
    let {id, isbn} = req.params;
    id = Number(id);
    db.authors.forEach((author) => {                          ///not working
        if(author.id ===id) {
            if(!author.books.includes(isbn)){
                return;
            }
            author.books = author.books.filter((book) => book!==isbn);
            return author;
        }
        return author;
    })
    return res.json(db.authors);
});

// http://localhost:3000/author-delete/12345ONE
app.delete("/author-delete/:id", (req, res) => {
    console.log(req.params);
    const {id} = req.params;               ///not working
    const filteredAuthors = db.authors.filter((author) => author.id!==id);
     console.log(filteredBooks);
    db.authors = filteredAuthors;
    return res.json(db.authors);
});

// http://localhost:3000/publication-delete/12345ONE
app.delete("/publication-delete/:id", (req, res) => {
});
 
app.listen(3000, () => {
    console.log("MY EXPRESS APP IS RUNNING.....")
});