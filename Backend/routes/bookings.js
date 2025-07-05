const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');

// Save booking
router.post('/', async (req, res) => {
  try {
    const booking = new Booking(req.body);
    await booking.save();
    res.status(201).json({ message: 'Booking saved successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET all bookings (admin view)
router.get('/', async (req, res) => {
    try {
      const bookings = await Booking.find();
      res.status(200).json(bookings);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  

module.exports = router;
