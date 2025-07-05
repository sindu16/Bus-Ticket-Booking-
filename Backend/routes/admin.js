const express = require('express');
const router = express.Router();
const Bus = require('../models/Bus');
const Booking = require('../models/Booking');
const jwt = require('jsonwebtoken');

// ==============================
// Bus Management
// ==============================

// POST - Add a new bus

router.post('/buses/add', async (req, res) => {
  const bus = new Bus(req.body);
  await bus.save();
  res.status(201).json({ msg: 'Bus added successfully' });
});

// GET all buses

router.get('/buses/all', async (req, res) => {
  try {
    const buses = await Bus.find(); // get all buses from DB
    res.json(buses); // send to frontend
  } catch (err) {
    console.error("Error fetching buses:", err);
    res.status(500).json({ error: 'Server error while fetching buses' });
  }
});

// UPDATE BUSES

router.put("/buses/update/:id", async (req, res) => {
  const bus = await Bus.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(bus);
});

// DELETE BUSES

router.delete("/buses/delete/:id", async (req, res) => {
  await Bus.findByIdAndDelete(req.params.id);
  res.json({ message: "Bus deleted" });
});


module.exports = router;
