const asyncHandler = require('express-async-handler')
const Product = require('../model/productModel')
const User = require('../model/userModel')

const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ user: req.user.id })
  res.status(200).json(products)
})

const createProduct = asyncHandler(async (req, res) => {
  const { name, category, price, duration, description, status } = req.body

  if (!name || !category || !price) {
    res.status(400)
    throw new Error('Please provide name, category, and price')
  }

  const product = await Product.create({
    name,
    category,
    price,
    duration: duration || 'N/A',
    description: description || '',
    status: status || 'Active',
    user: req.user.id,
  })

  res.status(201).json(product)
})

const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)

  if (!product) {
    res.status(404)
    throw new Error('Product not found')
  }

  if (product.user.toString() !== req.user.id) {
    res.status(401)
    throw new Error('Not authorized to update this product')
  }

  const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  })

  res.status(200).json(updatedProduct)
})

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)

  if (!product) {
    res.status(404)
    throw new Error('Product not found')
  }

  if (product.user.toString() !== req.user.id) {
    res.status(401)
    throw new Error('Not authorized to delete this product')
  }

  await product.deleteOne()
  res.status(200).json({ message: `Product ${req.params.id} deleted` })
})

module.exports = {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
}
