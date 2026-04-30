const mongoose = require('mongoose')

const productSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      type: String,
      required: [true, 'Please add a product/service name'],
    },
    category: {
      type: String,
      required: [true, 'Please add a category'],
      enum: ['Membership', 'Personal Training', 'Group Class', 'Wellness Service', 'Other'],
    },
    price: {
      type: Number,
      required: [true, 'Please add a price'],
    },
    duration: {
      type: String,
      default: 'N/A',
    },
    description: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive'],
      default: 'Active',
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Product', productSchema)
