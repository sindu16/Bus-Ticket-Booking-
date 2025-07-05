import  { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSeatsRequest } from '../ReduxSaga/seatSlice';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './SeatSelection.module.css';
import axios from 'axios';

// data initialization //

const rows = ['A', 'B','C','D'];
const cols = 9; 
const maxSeats = 10;

const SeatSelection = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {loading} = useSelector((state) => state.seats);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [fetchingSeats, setFetchingSeats] = useState(false);
  const [error, setError] = useState('');

  const location = useLocation();
 
  const {
    from = '',
    to = '',
    departure = '00:00',
    amPmDeparture = '',
    arrival = '',
    amPmArrival = '',
    price = 1600,
    bus = 'N/A',
    company = 'busName',
    duration = '00:00',
    busType = '',
  } = location.state || {};

  // fetch redux seats//

  useEffect(() => {
    if (from && to) {
      dispatch(fetchSeatsRequest({ from, to }));
      setSelectedSeats([]);
      setBookedSeats([]);
    }
  }, [from, to, dispatch]);

  // fetch booked seats from api

  useEffect(() => {
    if (!selectedDate || !from || !to || !bus || bus === 'N/A' || !company) {
      setBookedSeats([]);
      setError('');
      return;
    }

    refreshBookedSeats();
  }, [selectedDate, from, to, bus, company]);

  const refreshBookedSeats = async () => {
    setFetchingSeats(true);
    setError('');

    try {
      const response = await axios.get('http://localhost:5000/api/seats', {
        params: {
          date: selectedDate,
          busNo: bus,
          company: company,
          from,
          to,
        },
        timeout: 5000,
      });

      console.log('Full API Response:', response.data);
      console.log('Search parameters:', { 
        date: selectedDate, 
        busNo: bus, 
        company, 
        from, 
        to 
      });

      let bookedSeatIds = [];
      
      // Handle different response formats//
      if (Array.isArray(response.data)) {
        console.log('Response is array format');
        response.data.forEach((booking, index) => {
          console.log(`Booking ${index}:`, booking);
          
          // More flexible matching - check if any of the key fields match//
          const matchesRoute = (!booking.from || booking.from === from) && 
                              (!booking.to || booking.to === to);
          const matchesBus = (!booking.busNo || booking.busNo === bus) && 
                            (!booking.company || booking.company === company);
          const matchesDate = (!booking.date || booking.date === selectedDate || 
                              booking.journeyDate === selectedDate);
          
          if (matchesRoute && matchesBus && matchesDate) {
            console.log('Booking matches criteria:', booking);
            
            // Extract seat IDs from various possible fields//
            if (Array.isArray(booking.seatIds)) {
              bookedSeatIds.push(...booking.seatIds);
            } else if (booking.seatId) {
              bookedSeatIds.push(booking.seatId);
            } else if (booking.id) {
              bookedSeatIds.push(booking.id);
            } else if (booking.seats) {
              if (Array.isArray(booking.seats)) {
                bookedSeatIds.push(...booking.seats);
              } else {
                bookedSeatIds.push(booking.seats);
              }
            }
          }
        });
      } else if (response.data && typeof response.data === 'object') {
        console.log('Response is object format');
        
        // Handle nested seats array//
        if (Array.isArray(response.data.seats)) {
          response.data.seats.forEach(booking => {
            console.log('Nested booking:', booking);
            const matchesRoute = (!booking.from || booking.from === from) && 
                                (!booking.to || booking.to === to);
            const matchesBus = (!booking.busNo || booking.busNo === bus) && 
                              (!booking.company || booking.company === company);
            const matchesDate = (!booking.date || booking.date === selectedDate || 
                                booking.journeyDate === selectedDate);
            
            if (matchesRoute && matchesBus && matchesDate) {
              if (Array.isArray(booking.seatIds)) {
                bookedSeatIds.push(...booking.seatIds);
              } else if (booking.seatId) {
                bookedSeatIds.push(booking.seatId);
              }
            }
          });
        }
        
        // Handle direct bookedSeats array//
        if (Array.isArray(response.data.bookedSeats)) {
          console.log('Direct bookedSeats array:', response.data.bookedSeats);
          bookedSeatIds.push(...response.data.bookedSeats);
        }
        
        // Handle other possible field names//
        if (Array.isArray(response.data.seatIds)) {
          bookedSeatIds.push(...response.data.seatIds);
        }
      }

      // Clean and normalize seat IDs//
      bookedSeatIds = [...new Set(bookedSeatIds)] // Remove duplicates///
        .map(id => String(id).trim()) // Convert to string and trim//
        .filter(id => id && id !== 'undefined' && id !== 'null'); // Remove empty/invalid IDs//
      
      console.log('Final processed booked seat IDs:', bookedSeatIds);
      console.log('Setting booked seats state to:', bookedSeatIds);
      
      setBookedSeats(bookedSeatIds);
    } catch (error) {
      console.error('Error fetching booked seats:', error);
      if (error.code === 'ECONNREFUSED') {
        setError('Cannot connect to server. Please check if backend is running.');
      } else if (error.response) {
        setError(`Server error: ${error.response.status} - ${error.response.data?.message || 'Unknown error'}`);
      } else if (error.request) {
        setError('No response from server. Please check your network.');
      } else {
        setError(`Request error: ${error.message}`);
      }

      setBookedSeats([]);
    } finally {
      setFetchingSeats(false);
    }
  };

  const toggleSeat = (seatId) => {
    if (bookedSeats.includes(seatId)) return;

    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter(seat => seat !== seatId));
    } else {
      if (selectedSeats.length >= maxSeats) {
        alert(`You can select maximum ${maxSeats} seats`);
        return;
      }
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  const handleBooking = async () => {
    if (!selectedDate || selectedSeats.length === 0) {
      alert('Please select journey date and at least one seat');
      return false;
    }
    try {
      const response = await fetch('http://localhost:5000/api/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          seatIds: selectedSeats,
          journeyDate: selectedDate,
          company,
          busNo: bus, 
          from,
          to,
          // departure,
          // arrival,
          // price,
          // busType,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || `Booking failed with status: ${response.status}`);
        return false;
      } else {
        alert('Seat selected successful');
        
        // Store the currently selected seats before clearing//
        const currentlySelectedSeats = [...selectedSeats];
        
        // Clear selected seats
        setSelectedSeats([]);
        
        // Immediately update booked seats to show the newly booked seats as red//
        setBookedSeats(prev => {
          const newBookedSeats = [...prev, ...currentlySelectedSeats];
          console.log('Updated booked seats:', newBookedSeats);
          return newBookedSeats;
        });
        
        // Refresh from server after a short delay to ensure consistency//
        setTimeout(() => {
          refreshBookedSeats();
        }, 1500);
        
        return true;
      }
    } catch (error) {
      console.error('Booking error:', error);
      alert(`Network error: ${error.message}`);
      return false;
    }
  };

  const handleProceed = async () => {
    const seatsToBook = [...selectedSeats];
    const success = await handleBooking();
    if (success) {
      navigate('/passenger', {
        state: {
          from,
          to,
          departure,
          arrival,
          selectedSeats: seatsToBook,
          totalPrice: seatsToBook.length * price,
          pricePerSeat: price,
          busNo: bus,
          company,
          journeyDate: selectedDate,
          duration,
          ampmarrival: amPmArrival,
          ampmdeparture: amPmDeparture,
          busType,
        },
      });
    }
  };

  const renderSeats = () => {
    return rows.map((row) => (
      <div key={row} className={styles.row}>
        {[...Array(cols)].map((_, colIndex) => {
          const seatNumber = colIndex * 2 + (row === 'A' ? 1 : 2);
          const seatId = `${row}${seatNumber}`;

          const isBooked = bookedSeats.includes(seatId);
          const isSelected = selectedSeats.includes(seatId);

          // Enhanced debug logging//
          console.log(`Seat ${seatId}:`);
          console.log(`  - Current bookedSeats array:`, bookedSeats);
          console.log(`  - Is in booked array: ${bookedSeats.includes(seatId)}`);
          console.log(`  - Booked: ${isBooked}, Selected: ${isSelected}`);

          return (
            <div
              key={seatId}
              className={`${styles.seat} ${
                isBooked
                  ? styles.booked
                  : isSelected
                  ? styles.selected
                  : styles.available
              }`}
              onClick={() => !isBooked && toggleSeat(seatId)}
              title={
                isBooked 
                  ? 'Seat already booked' 
                  : isSelected 
                  ? 'Selected - Click to deselect' 
                  : 'Available - Click to select'
              }
              style={{ 
                cursor: isBooked ? 'not-allowed' : 'pointer',
                // Force booked seats to be red //
                backgroundColor: isBooked ? '#dc3545' : isSelected ? '#ffc107' : '#fff',
                color: isBooked ? '#fff' : isSelected ? '#000' : '#333',
                border: isBooked ? '1px solid #dc3545' : isSelected ? '1px solid #ffc107' : '1px solid #aaa'
              }}
            >
              {seatId}
            </div>
          );
        })}
      </div>
    ));
  };

//  Date Picker allows today and future dates //
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Seat Selection for {company} - Bus {bus}</h2>

      {error && (
        <div className={styles.error}>
          <strong>Error:</strong> {error}
        </div>
      )}

      <div className={styles.wrapper}>
        <div className={styles.seatSection}>
          <div className={styles.routeDisplay}>
            <strong>Company:</strong> {company} &nbsp;|&nbsp;
            <strong>From:</strong> {from} &nbsp;|&nbsp; <strong>To:</strong> {to}
          </div>

          <div className={styles.datePicker}>
            <label><strong>Select Journey Date:</strong></label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={today}
              className={styles.dateInput}
              required
            />
          </div>

          {(loading || fetchingSeats) ? (
            <p>{loading ? 'Loading seats...' : 'Fetching booked seats...'}</p>
          ) : (
            <div className={styles.seatLayout}>{renderSeats()}</div>
          )}

          <div className={styles.legend}>
            <div><span className={`${styles.box} ${styles.available}`}></span> Available</div>
            <div><span className={`${styles.box} ${styles.booked}`}></span> Booked</div>
            <div><span className={`${styles.box} ${styles.selected}`}></span> Selected</div>
            <div><span className={styles.priceTag}>Rs. {price}</span></div>
          </div>
        </div>

        <div className={styles.detailsPanel}>
          <h4 className={styles.title}>Your Destination</h4>
          <div className={styles.routeInfo}>
            <div>
              <p><strong>Bus Name:</strong> {company}</p>
              <p><strong>Bus No:</strong> {bus}</p>
            </div>
            <div>
              <strong>Origin</strong><br />
              {from}<br />
              ({departure} {amPmDeparture})
            </div>
            <div className={styles.separator}>...</div>
            <div>
              <strong>Destination</strong><br />
              {to}<br />
              ({arrival} {amPmArrival})
            </div>
            <div>
              <strong>Duration</strong><br />
              {duration}
            </div>
          </div>

          <div className={styles.journeyDate}>
            <p><strong>Bus Type:</strong> {busType}</p>
            <strong>Journey Date:</strong> {selectedDate || 'No date selected'}
          </div>

          <div className={styles.selectedSeats}>
            <strong>Selected Seats:</strong> {selectedSeats.join(', ') || 'None'}
          </div>

          <div className={styles.totalPrice}>
            <strong>Total Price:</strong> Rs. {selectedSeats.length * price}
          </div>

          <button className={styles.proceedBtn} onClick={handleProceed}>
            Proceed
          </button>
        </div>
      </div>
    </div>
  );
};

export default SeatSelection;
















