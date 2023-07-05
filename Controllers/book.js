const Book = require('../Models/Book')
const fs = require('fs')


exports.getBooks =(req,res,next) => {
    Book.find()
        .then(books => res.status(200).json(( books )))
        .catch(error => res.status(400).json({ error }))
}
exports.getBook = (req, res, next) => {
    Book.findById({_id: req.params.id,})
        .then(book => {
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
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        ratings: { 
            userId: req.auth.userId,
            grade: bookObject.ratings[0].grade
        },
        averageRating: bookObject.ratings[0].grade,
    });
    book.save()
    .then(() => { res.status(201).json({message: 'Objet enregistré !'})})
    .catch(error => { res.status(400).json( { error })})
};


exports.modifyBook = (req, res, next) => {
    const bookObject = req.file ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    delete bookObject._userId;
    Book.findOne({_id: req.params.id})
        .then((book) => {
            if (book.userId != req.auth.userId) {
                res.status(401).json({ message : 'Not authorized'});
            } else {
                Book.updateOne({ _id: req.params.id}, 
                    { ...bookObject, _id: req.params.id})
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

exports.modifyRating = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
        .then(async book => {
            const user = req.body.userId;
            if (user !== req.auth.userId) {
            return res
                .status(403)
                .json({ error: "Vous ne pouvez pas voter pour ce livre." });
            }
    
            const newRatingObject = {
            userId: req.auth.userId,
            grade: req.body.rating,
            _id: req.body._id,
            };
    
            if (book.ratings.some(rating => rating.userId === req.auth.userId)) {
            return res
                .status(403)
                .json({ error: "Vous avez déjà voté pour ce livre." });
            } else {
            book.ratings.push(newRatingObject);
            const allRatings = book.ratings.map(rating => rating.grade);
            const newAverageRating = (
                allRatings.reduce((acc, curr) => acc + curr, 0) / allRatings.length
            ).toFixed(1);
    
            try {
                await Book.updateOne(
                { _id: req.params.id },
                { ratings: book.ratings, averageRating: newAverageRating },
                { new: true }
                );
    
                const updatedBook = await Book.findOne({ _id: req.params.id });
                return res.status(200).json(updatedBook);
            } catch (error) {
                throw error;
            }
            }
        })
        .catch(error => {
            return res.status(500).json({ error });
        });
    };

exports.getBestRating = (req, res, next) => {
    Book.find()
        .sort({ averageRating: -1 })//-1 pour un ordre décroissant
        .limit(3)//N'affiche que les 3 plus grande note 
        .then(books => res.status(200).json(books))
        .catch(error => res.status(400).json({ error }));
    };