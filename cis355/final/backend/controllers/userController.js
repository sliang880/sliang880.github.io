const asyncHandler = require('express-async-handler')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const User = require('../model/userModel')

const registerUser = asyncHandler(async (req, res) => {
  const { username, name, email, password } = req.body

  if (!username || !name || !email || !password) {
    throw new Error('Please add all fields')
  }

  const userExists = await User.findOne({
    $or: [{ email }, { username }],
  })
  if (userExists) {
    res.status(400)
    throw new Error('User already exists with this email or username')
  }

  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  const user = await User.create({
    username,
    name,
    email,
    password: hashedPassword,
  })

  if (user) {
    res.status(201).json({
      _id: user.id,
      username: user.username,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    })
  } else {
    res.status(400)
    throw new Error('Invalid user data')
  }
})

const loginUser = asyncHandler(async (req, res) => {
  const { loginField, password } = req.body

  if (!loginField || !password) {
    res.status(400)
    throw new Error('Please provide login field and password')
  }

  const user = await User.findOne({
    $or: [{ email: loginField }, { username: loginField }],
  })

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user.id,
      username: user.username,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    })
  } else {
    res.status(401)
    throw new Error('Invalid credentials')
  }
})

const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id)
  res.status(200).json({
    id: user._id,
    username: user.username,
    name: user.name,
    email: user.email,
  })
})

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' })
}

module.exports = {
  registerUser,
  loginUser,
  getMe,
}
