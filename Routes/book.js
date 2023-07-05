const express = require('express');
const router = express.Router();
const bookCtrl = require('../Controllers/book')
const auth = require('../Middleware/auth');
const multer = require('../Middleware/multer-config');
const conversion = require('../Middleware/sharp')


router.get('/', bookCtrl.getBooks);
router.get('/bestrating', bookCtrl.getBestRating); // La route doit être placée avant /:id pour ne pas empecher la récupération des autres livres
router.post('/', auth, conversion, multer, bookCtrl.createBook);
router.get('/:id', bookCtrl.getBook);
router.put('/:id', auth, multer,bookCtrl.modifyBook);
router.delete('/:id', auth,bookCtrl.deleteBook);
router.post("/:id/rating", auth, bookCtrl.modifyRating);

module.exports = router;

