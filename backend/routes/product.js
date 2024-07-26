import express from 'express';
import { isAuth } from '../middleware/isAuth.js';
import { uploadFiles } from '../middleware/multer.js';
import { createProduct, deleteProduct, fetchAllProducts, fetchSingleProduct, updateStock } from '../controller/product.js';

const router = express.Router();

router.post("/product/new", isAuth, uploadFiles, createProduct)
router.get("/product/all-products", fetchAllProducts)
router.get("/product/single/:id", fetchSingleProduct)
router.delete("/product/:id",isAuth, deleteProduct)
router.put("/product/update-stock/:id",isAuth, updateStock)


export default router;