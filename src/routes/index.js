const express = require('express')

const router = express.Router()

// Controller
const { addUsers, getUsers, getUser, updateUser, deleteUser } = require('../controllers/user')
const { getProduct, addProduct } = require('../controllers/product')
const { getTransactions, addTransaction } = require('../controllers/transaction')
const { register, login } = require('../controllers/auth')

// Middleware
const { auth } = require('../middlewares/auth')
// import middleware here
const {uploadFile} = require('../middlewares/uploadFile')

// Route
router.post('/user', addUsers)
router.get('/users', getUsers)
router.get('/user/:id', getUser)
router.patch('/user/:id', updateUser)
router.delete('/user/:id', deleteUser)

router.get('/products', getProduct)
router.post('/product', auth, uploadFile("image"), addProduct) // place middleware before controller

router.get('/transactions', getTransactions)
router.post('/transaction', auth, addTransaction)

router.post('/register', register)
router.post('/login', login)

module.exports = router