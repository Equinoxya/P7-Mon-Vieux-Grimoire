const express = require('express');
const router = express.Router();
const bookCtrl = require('../Controllers/stuff')
const auth = require('../Middleware/auth');
const multer = require('../Middleware/mutler-config')


router.get('/', bookCtrl.getBooks);
router.post('/', auth, multer,bookCtrl.createBook);
//route pour aller chercher un livre par son id
router.get('/:id', bookCtrl.getBook);
router.get('/:id', auth,bookCtrl.getOneBook);
router.put('/:id', auth, multer,bookCtrl.modifyBook);
router.delete('/:id', auth,bookCtrl.deleteBook);
//router.post("/:id/rating", auth, postRating);
module.exports = router;

