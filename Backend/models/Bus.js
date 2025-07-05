const mongoose = require('mongoose');

const busSchema = new mongoose.Schema({
 busNumber: String,
  name: String,
  from: String,
  to: String,
  time: String,
  amPmDeparture:String,
  arrive: String,
  amPmArrival:String,
  duration: String,
  price: Number,
  seats: Number,
  company: String,
  busType: String, 
  
  
  amenities: [String],
});

module.exports = mongoose.model('Bus', busSchema);
