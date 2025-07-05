const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: String,
  email: String,
  phone: String,
  altPhone: String,
  pickupStation: String,
  dropStation: String,
  seatCount: Number,
  selectedSeats: [String],
  from: String,
  to: String,
  departure: String,
  arrival: String,
  busName: String,
  busNo: String,
  pricePerSeat: Number,
  totalPrice: Number,
  journeyDate: String,
}, {
  timestamps: true // Adds createdAt and updatedAt
});

module.exports = mongoose.model('Bookings', bookingSchema);
