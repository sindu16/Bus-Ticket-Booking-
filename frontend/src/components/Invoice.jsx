import  { useRef, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import styles from './Invoice.module.css';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import buslogo from '../assets/logo1.png';

const Invoice = () => {
  const { state } = useLocation();
  const {
    name,
    pickupStation,
    dropStation,
    from,
    to,
    departure,
    arrival,
    selectedSeats,
    totalPrice,
    pricePerSeat,
    busNo,
    busName,
    journeyDate,
    ampmdeparture,
    ampmarrival,
    duration,
    busType
  } = state || {};

  const billNo = state?.billNo || `INV-${Date.now()}`;
  const invoiceRef = useRef();

  const [bookingDate, setBookingDate] = useState('');

  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0]; 
    setBookingDate(formattedDate);
  }, []);

  const downloadPDF = () => {
    const input = invoiceRef.current;
    html2canvas(input, { scale: 2, useCORS: true }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${billNo}.pdf`);
    });
  };

  return (
    <div className={styles.invoiceWrapper}>
      <h1 className={styles.title}>Collect Your Invoice</h1>

      <div className={styles.ticketCard} ref={invoiceRef}>
        {/* Left Section */}
        <div className={styles.leftSection}>
          <div className={styles.headerRed}>
            <img src={buslogo} alt="Bus" className={styles.busImage} />
            <h3>JOE Travels</h3>
            <div className={styles.headerText}>
              <h5>Bus Name : {busName}</h5>
              <small>Bus No : {busNo}</small>
            </div>
            <div className={styles.ticketLabel}>Bus Ticket</div>
          </div>

          <div className={styles.infoSection}>
            <div className={styles.detailsRow}>
              <span>Bill No: {billNo}</span>
              <span>NPR {pricePerSeat} /seat</span>
              <span>Date: {bookingDate}</span>
            </div>

            <div className={`row mt-5 ${styles.InvoiceCenter}`}>
              <div className={`col-6 ${styles.InvoiceFields}`}>
                <p><strong>Name of Passenger:</strong> {name}</p>
                <p><strong>Total Seat No.:</strong> {selectedSeats.join(', ')}</p>
                <p><strong>Total No. of Passenger:</strong> {selectedSeats.length} Only</p>
                <p><strong>Pickup Station:</strong> {pickupStation}</p>
                <p><strong>Drop Station:</strong> {dropStation}</p>
              </div>

              <div className={`col-6 d-flex justify-content-end ${styles.qr}`}>
                <QRCodeSVG
                  value={`Name: ${name}, Seats: ${selectedSeats.join(', ')}, Total: NPR ${totalPrice},Bus Name: ${busName},Bus Number: ${busNo}`}
                  size={145}
                />
              </div>
            </div>

            <div className={styles.routeInfo}>
              <p>{from} ------ {to}</p>
              <p> Departure at {departure}{ampmdeparture} &nbsp;&nbsp;|&nbsp;&nbsp; Arrive at {arrival}{ampmarrival}</p>
            </div>

            <div className={styles.priceStatus}>
              <div>
                <strong>Total Price</strong>
                <h2>Rs.{totalPrice}</h2>
              </div>
              <span className={styles.paidStatus}>✔ Bill Paid</span>
            </div>
          </div>

          <div className={styles.footerNote}>
            Note: 40% charge for cancellation within 24 hours of departure.
          </div>
        </div>

        {/* Right Section */}
        <div className={styles.rightSection}>
          <div className={styles.ticketText}>
            <p><strong>Bill No.:</strong> {billNo}</p>
            <p><strong>Journey Date:</strong> {journeyDate}</p>
            <p><strong>Name:</strong> {name}</p>
            <p><strong>Origin:</strong> {from}</p>
            <p><strong>Destination:</strong> {to}</p>
            <p><strong>Bus Type:</strong> {busType}</p>
            <p><strong>Departure:</strong> {departure}{ampmdeparture}</p>
            <p><strong> Arrive:</strong> {arrival}{ampmarrival}</p>
            <p><strong>Duration:</strong> {duration}</p>
            <p><strong>Seat No.:</strong> {selectedSeats.join(', ')}</p>
            <p><strong>Total Passenger:</strong> {selectedSeats.length} Only</p>
            <p><strong>Total Price:</strong> Rs. {totalPrice}</p>
          </div>

          <div className={styles.contactStrip}>
            📞 +91-9688391748 | +91-9384217763
          </div>
        </div>
      </div>

      <button className={styles.downloadBtn} onClick={downloadPDF}>
        Download Invoice
      </button>
    </div>
  );
};

export default Invoice;


