require('dotenv').config()
require('./config/db')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const User = require('./model/userModel')
const Product = require('./model/productModel')

const autoSeed = async () => {
  try {
    const existingUser = await User.findOne({ username: 'svsu' })
    if (existingUser) {
      console.log('Seed data already exists, skipping.')
      return
    }

    await User.deleteMany({})
    await Product.deleteMany({})

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash('cardinal', salt)

    const testUser = await User.create({
      username: 'svsu',
      name: 'SVSU Admin',
      email: 'svsu@admin.com',
      password: hashedPassword,
    })

    console.log('Test user created:', testUser.username)

    const sampleProducts = [
      {
        name: 'Basic Membership',
        category: 'Membership',
        price: 29.99,
        duration: 'Monthly',
        description: 'Access to gym floor and basic equipment during regular hours.',
        status: 'Active',
        user: testUser._id,
      },
      {
        name: 'Premium Membership',
        category: 'Membership',
        price: 59.99,
        duration: 'Monthly',
        description: 'Full gym access including pool, sauna, and group classes.',
        status: 'Active',
        user: testUser._id,
      },
      {
        name: 'Personal Training - 1 Session',
        category: 'Personal Training',
        price: 50.0,
        duration: '1 Hour',
        description: 'One-on-one session with a certified personal trainer.',
        status: 'Active',
        user: testUser._id,
      },
      {
        name: 'Yoga Class - Group',
        category: 'Group Class',
        price: 15.0,
        duration: '1 Hour',
        description: 'Relaxing yoga session for all skill levels.',
        status: 'Active',
        user: testUser._id,
      },
      {
        name: 'Nutrition Consultation',
        category: 'Wellness Service',
        price: 75.0,
        duration: '45 Minutes',
        description: 'Personalized nutrition plan with a registered dietitian.',
        status: 'Active',
        user: testUser._id,
      },
      {
        name: 'Annual VIP Pass',
        category: 'Membership',
        price: 499.99,
        duration: 'Yearly',
        description: 'All-inclusive annual pass with priority booking and guest passes.',
        status: 'Active',
        user: testUser._id,
      },
    ]

    await Product.insertMany(sampleProducts)
    console.log(`${sampleProducts.length} sample products created for ${testUser.username}`)

    console.log('\n=== Seed Data Complete ===')
    console.log('Test Account:')
    console.log('  Username: svsu')
    console.log('  Password: cardinal')

  } catch (error) {
    console.error('Seed Error:', error.message)
  }
}

if (require.main === module) {
  autoSeed().then(() => process.exit(0))
}

module.exports = { autoSeed }
