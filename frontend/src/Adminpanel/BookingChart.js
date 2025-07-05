import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BookingChart = () => {
  const [chartData, setChartData] = useState(null); // start with null
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/bookings');
        const data = res.data;

        if (!Array.isArray(data)) {
          console.error('Invalid bookings data:', data);
          return;
        }

        const grouped = data.reduce((acc, curr) => {
          const bus = curr.busName || 'Unknown Bus';
          const seats = Array.isArray(curr.seats) ? curr.seats.length : curr.seatCount || 1;
          acc[bus] = (acc[bus] || 0) + seats;
          return acc;
        }, {});

        const labels = Object.keys(grouped);
        const seatCounts = Object.values(grouped);

        setChartData({
          labels,
          datasets: [
            {
              label: 'Seats Booked',
              data: seatCounts,
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1
            }
          ]
        });
      } catch (error) {
        console.error('Error fetching booking data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading chart...</div>;
  if (!chartData || !chartData.labels?.length) return <div>No booking data available.</div>;

  return (
    <div style={{ width: '100%', maxWidth: '600px', marginTop: '2rem' }}>
      <Bar data={chartData} />
    </div>
  );
};

export default BookingChart;
