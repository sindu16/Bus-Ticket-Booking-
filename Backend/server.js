
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const bookingRoutes = require('./routes/bookings');
// const seatRoutes = require('./routes/seatRoutes')



const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB connected');
}).catch((err) => {
  console.error('MongoDB connection error:', err.message);
});

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/bookings', bookingRoutes);
// app.use('/api/seats',seatRoutes)


// Mongoose Seat Model
const seatSchema = new mongoose.Schema({
  seatId: { type: String, required: true },
  journeyDate: { type: String, required: true },  // or Date type
  company: {type:String, required: true },
  busNo: { type: String, required: true },
  isBooked: { type: Boolean, default: false },
  from:{type:String, required: true},
  to:{type:String, required: true},
});


const Seat = mongoose.model('Seates', seatSchema);


// ✅ BOOK SEATS Endpoint
// Inside server.js

// Example Express booking route
app.post('/api/book', async (req, res) => {
  try {
    const { seatIds, journeyDate,company, busNo, from, to } = req.body;

    if (!seatIds || !journeyDate || !company || !busNo || !from || !to ) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if any requested seat is already booked
    const bookedSeats = await Seat.find({
      seatId: { $in: seatIds },
      journeyDate,
      company,
      busNo,
      isBooked: true,
      from,
      to,
    });

    if (bookedSeats.length > 0) {
      return res.status(409).json({
        message: `Seats already booked: ${bookedSeats.map(s => s.seatId).join(', ')}`,
      });
    }

    // Mark seats as booked, using bulkWrite upsert to insert or update
    const bulkOps = seatIds.map(seatId => ({
      updateOne: {
        filter: { seatId, journeyDate,company, busNo, from, to },
        update: { $set: { isBooked: true } },
        upsert: true,
      }
    }));

    const result = await Seat.bulkWrite(bulkOps);
    console.log('Seats booked:', result);

    res.json({ message: 'Booking successful' });
  } catch (err) {
    console.error('Booking error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


// ✅ FETCH BOOKED SEATS Endpoint
app.get('/api/seats', async (req, res) => {
  const { date } = req.query;

  if (!date) {
    return res.status(400).json({ message: 'Missing required date query' });
  }

  try {
    const bookedSeats = await Seat.find({ journeyDate: date });
    res.status(200).json(bookedSeats);

    
  } catch (err) {
    console.error('Error fetching seats:', err);
    res.status(500).json({ message: 'Failed to fetch seats' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));

