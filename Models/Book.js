const mongoose = require("mongoose");

const booksSchema = mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, require: true, unique: true },
  author: { type: String },
  imageUrl: { type: String, require: true },
  year: { type: Number },
  genre: { type: String },
  ratings: [
    {
      userId: { type: String, required: true },
      grade: { type: Number, min: 1, max: 5, required: true },
    },
  ],
  averageRating: { type: Number },
});


module.exports = mongoose.model("books", booksSchema);