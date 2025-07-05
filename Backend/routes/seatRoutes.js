// const express = require('express');
// const router = express.Router();
// const Seat = require('../models/Seat');

// // ✅ Book seats route
// router.post('/book', async (req, res) => {
//   try {
//     const { seatIds, journeyDate, company, busNo, from, to } = req.body;

//     if (!seatIds || !journeyDate || !company || !busNo || !from || !to) {
//       return res.status(400).json({ message: 'Missing required fields' });
//     }

//     const bookedSeats = await Seat.find({
//       seatId: { $in: seatIds },
//       journeyDate,
//       company,
//       busNo,
//       from,
//       to,
//       isBooked: true,
//     });

//     if (bookedSeats.length > 0) {
//       return res.status(409).json({
//         message: `Seats already booked: ${bookedSeats.map(s => s.seatId).join(', ')}`,
//       });
//     }

//     const bulkOps = seatIds.map(seatId => ({
//       updateOne: {
//         filter: { seatId, journeyDate, company, busNo, from, to },
//         update: { $set: { isBooked: true } },
//         upsert: true,
//       }
//     }));

//     const result = await Seat.bulkWrite(bulkOps);
//     console.log('Seats booked:', result);

//     res.json({ message: 'Booking successful' });
//   } catch (err) {
//     console.error('Booking error:', err);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// });

// // ✅ Fetch booked seats route
// router.get('/', async (req, res) => {
//   const { date } = req.query;

//   if (!date) {
//     return res.status(400).json({ message: 'Missing required date query' });
//   }

//   try {
//     const bookedSeats = await Seat.find({ journeyDate: date });
//     res.status(200).json(bookedSeats);
//   } catch (err) {
//     console.error('Error fetching seats:', err);
//     res.status(500).json({ message: 'Failed to fetch seats' });
//   }
// });

// module.exports = router;
