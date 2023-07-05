const express = require('express');
const router = express.Router();
const bookCtrl = require('../Controllers/book')
const auth = require('../Middleware/auth');
const multer = require('../Middleware/multer-config')


router.get('/', bookCtrl.getBooks);
router.post('/', auth, multer,bookCtrl.createBook);
router.get('/:id', bookCtrl.getBook);
router.get('/bestrating', bookCtrl.getBestRating);
router.put('/:id', auth, multer,bookCtrl.modifyBook);
router.delete('/:id', auth,bookCtrl.deleteBook);
router.post("/:id/rating", auth, bookCtrl.rateBook);

module.exports = router;

