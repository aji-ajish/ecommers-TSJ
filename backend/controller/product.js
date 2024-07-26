import { Product } from "../models/Product.js"
import { rm } from "fs"


// Add Product
export const createProduct = async (req, res) => {
    try {
        if (req.user.role != "admin") {
            return res.status(401).json({
                message: "Unauthorized Access"
            })
        }
        const { title, description, stock, price, category } = req.body
        const image = req.file
        if (!image) {
            return res.status(400).json({
                message: "Please Select the image"
            })
        }

        // store to db
        const product = await Product.create({
            title,
            description,
            stock,
            price,
            category,
            image: image?.path
        })
        return res.status(500).json({
            message: "Product Details added Success",
            product
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}

// fetch all products
export const fetchAllProducts = async (req, res) => {
    try {
        const products = await Product.find()
        return res.status(200).json({
            message: "Product List", products
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}

// fetch single products
export const fetchSingleProduct = async (req, res) => {
    try {
        const id = req.params.id;
        const product = await Product.findById(id)
        return res.status(200).json({
            message: "Product Detail", product
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}

// delete products
export const deleteProduct = async (req, res) => {
    try {
        if (req.user.role != "admin") {
            return res.status(401).json({
                message: "Unauthorized Access"
            })
        }

        const id = req.params.id;
        const product = await Product.findById(id)

        if (!product) {
            return res.status(403).json({
                message: "Invalid Product Detail"
            })
        }
        rm(product.image, () => {
            console.log('image deleted');
        })
        await product.deleteOne()

        return res.json({
            message: "Product Detail Deleted Success"
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}

// update stock
export const updateStock = async (req, res) => {
    try {
        if (req.user.role != "admin") {
            return res.status(401).json({
                message: "Unauthorized Access"
            })
        }

        const id = req.params.id;
        const product = await Product.findById(id)

        if (!product) {
            return res.status(403).json({
                message: "Invalid Product Detail"
            })
        }
        if (req.body.stock) {
            product.stock = req.body.stock
            await product.save();

            return res.json({
                message: "Product Stock Updated"
            })
        }
        return res.status(400).json({
            message: "Please Enter Stock Value"
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}


