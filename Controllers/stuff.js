const Book = require('../Models/Book')
const fs = require('fs')


exports.getBooks =(req,res,next) => {
    Book.find()
        .then(books => res.status(200).json(( books )))
        .catch(error => res.status(400).json({ error }))
}
exports.getBook = (req, res, next) => {
    const bookId = req.params.id; // Supposons que l'ID soit passé en tant que paramètre d'URL

    Book.findById(bookId)
        .then(book => {
            if (!book) {
                // Si aucun livre correspondant n'est trouvé, renvoyez une réponse d'erreur
                return res.status(404).json({ message: 'Livre non trouvé.' });
            }
            res.status(200).json(book);
        })
        .catch(error => res.status(400).json({ error }));
};

exports.createBook = (req, res, next) => {
    const bookObject = JSON.parse(req.body.book);
    console.log(bookObject);
    delete bookObject._id;
    delete bookObject._userId;
    const book = new Book({
        ...bookObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    book.save()
    .then(() => { res.status(201).json({message: 'Objet enregistré !'})})
    .catch(error => { res.status(400).json( { error })})
};
exports.modifyBook = (req, res, next) => {
    const bookObject = req.file ? {
        ...JSON.parse(req.body.thing),
        imageUrl: `${req.protocol}://${req.get('localhost:4000')}/images/${req.file.filename}`
    } : { ...req.body };
    delete bookObject._userId;
    Book.findOne({_id: req.params.id})
        .then((thing) => {
            if (thing.userId != req.auth.userId) {
                res.status(401).json({ message : 'Not authorized'});
            } else {
                Book.updateOne({ _id: req.params.id}, { ...thingObject, _id: req.params.id})
                .then(() => res.status(200).json({message : 'Objet modifié!'}))
                .catch(error => res.status(401).json({ error }));
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
};
exports.deleteBook = (req, res, next) => {
    Book.findOne({_id: req.params.id})
        .then(book => {
            if(book.userId != req.auth.userId){
                res.status(401).json({ message : 'Non autorisé'})
            } else {
                const filename = book.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => 
                Book.deleteOne({_id: req.params.id})
                    .then(() => {res.status(200).json({ message: 'Livre supprimé'})})
                    .catch( error => res.status(401).json({ error }))
                )
            }
        })
        .catch(error => res.status(500).json({ error }))
}
exports.getOneBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
        .then( book => res.status(200).json((book)))
        .catch( error => res.status(400).json({ error }))
}
exports.postRating = (req, res) => {
    const id = req.params.id;
    if (id == null || id == "undefined") {
      res.status(400).send("Book id is missing");
      return;
    }
    const rating = req.body.rating;
    const userId = req.tokenPayload.userId;
    try {
      const book = Book.findById(id);
      if (book == null) {
        res.status(404).send("Book not found");
        return;
      }
      const ratingsInDb = book.ratings;
      const previousRatingFromCurrentUser = ratingsInDb.find(
        (rating) => TimeRanges.userId == userId
      );
      if (previousRatingFromCurrentUser != null) {
        res.status(404).send("you have already rated this book");
        return;
      }
      const newRating = { userId: userId, grade: rating };
      ratingsInDb.push(newRating);
      book.averageRating = calculateAverageRating(ratingsInDb);
      book.save();
      res.send("rating posted");
    } catch (e) {
      console.error(e);
      res.status(500).send("Something went wrong: " + e.message);
    }
  }