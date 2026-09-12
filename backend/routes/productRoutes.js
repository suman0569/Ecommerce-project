const express = require('express');
const {getProducts, getProductById, createProduct, updateProduct, deleteProduct} = require('../controller/productController');
const {admin} = require('../middleware/adminMiddleware');
const {protect} = require('../middleware/authMiddleware');
const multer = require('multer');
const upload = multer({dest:'uploads/'});

const router=express.Router();

router.route('/').get(getProducts).post(protect,admin, upload.single('image'), createProduct);
router.route('/:id').get(getProductById).put(protect,admin,upload.single('image'), updateProduct).delete(protect,admin,deleteProduct);


module.exports = router;
