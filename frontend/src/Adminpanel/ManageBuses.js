import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addBusRequest,
  fetchBusesRequest,
  updateBusRequest,
  deleteBusRequest,
} from "../ReduxSaga/busesSlice";
import styles from "./ManageBuses.module.css";

const ManageBuses = () => {
  const dispatch = useDispatch();
  const { buses, loading, error } = useSelector((state) => state.buses);

  const [form, setForm] = useState({
    _id: null,
    busNumber: "",
    name: "",
    from: "",
    to: "",
    departure: "",
    amPmDeparture: "AM",
    arrival: "",
    amPmArrival: "AM",
    price: "",
    seats: "",
    company: "",
    busType: "",
    amenities: [],
  });

  const [lastAction, setLastAction] = useState(null);

  const allAmenities = [
    "WiFi",
    "AC",
    "Water Bottle",
    "Charging Port",
    "Blanket",
    "LED TV & Music",
     "Non-AC"
  ];
  const busTypes = ["Sleeper", "Seater"];

  useEffect(() => {
    dispatch(fetchBusesRequest());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAmenityChange = (e) => {
    const { value, checked } = e.target;
    setForm((prev) => {
      const newAmenities = checked
        ? [...prev.amenities, value]
        : prev.amenities.filter((a) => a !== value);
      return { ...prev, amenities: newAmenities };
    });
  };

  const convert12To24 = (time12, ampm) => {
    let [hours, minutes] = time12.split(":").map(Number);
    if (ampm === "PM" && hours < 12) hours += 12;
    if (ampm === "AM" && hours === 12) hours = 0;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
  };

  const convert24To12 = (time24) => {
    let [hours, minutes] = time24.split(":").map(Number);
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return {
      time: `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`,
      ampm,
    };
  };

  const calculateDuration = (depTime, depAmpm, arrTime, arrAmpm) => {
    const [depHours, depMinutes] = convert12To24(depTime, depAmpm)
      .split(":")
      .map(Number);
    const [arrHours, arrMinutes] = convert12To24(arrTime, arrAmpm)
      .split(":")
      .map(Number);

    let depTotal = depHours * 60 + depMinutes;
    let arrTotal = arrHours * 60 + arrMinutes;

    if (arrTotal < depTotal) arrTotal += 1440; // Next day arrival

    const diff = arrTotal - depTotal;
    const h = Math.floor(diff / 60);
    const m = diff % 60;

    return `${h}h ${m}m`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const time = convert12To24(form.departure, form.amPmDeparture);
    const arrive = convert12To24(form.arrival, form.amPmArrival);
    const duration = calculateDuration(
      form.departure,
      form.amPmDeparture,
      form.arrival,
      form.amPmArrival
    );

    const busData = {
      ...form,
      time,
      arrive,
      duration,
      price: Number(form.price),
      seats: Number(form.seats),
    };

    
    delete busData.departure;
    delete busData.arrival;

    if (form._id) {
      dispatch(updateBusRequest(busData));
      setLastAction("update");
    } else {
      dispatch(addBusRequest(busData));
      setLastAction("add");
    }
  };

  const handleEdit = (bus) => {
    const dep12 = convert24To12(bus.time);
    const arr12 = convert24To12(bus.arrive);

    setForm({
      _id: bus._id,
      busNumber: bus.busNumber,
      name: bus.name,
      from: bus.from,
      to: bus.to,
      departure: dep12.time,
      amPmDeparture: bus.amPmDeparture || dep12.ampm,
      arrival: arr12.time,
      amPmArrival: bus.amPmArrival || arr12.ampm,
      price: bus.price,
      seats: bus.seats,
      company: bus.company,
      type:bus.busType,
      amenities: bus.amenities || [],
    });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this bus?")) {
      dispatch(deleteBusRequest(id));
    }
  };

  useEffect(() => {
    if (!loading && !error && lastAction === "add") {
      alert("Bus added successfully!");
      setLastAction(null);
      setForm({
        _id: null,
        busNumber: "",
        name: "",
        from: "",
        to: "",
        departure: "",
        amPmDeparture: "AM",
        arrival: "",
        amPmArrival: "AM",
        price: "",
        seats: "",
        company: "",
        busType: "",
        amenities: [],
      });
      dispatch(fetchBusesRequest());
    }

    if (!loading && !error && lastAction === "update") {
      alert("Bus updated successfully!");
      setLastAction(null);
      setForm({
        _id: null,
        busNumber: "",
        name: "",
        from: "",
        to: "",
        departure: "",
        amPmDeparture: "AM",
        arrival: "",
        amPmArrival: "AM",
        price: "",
        seats: "",
        company: "",
        busType: "",
        amenities: [],
      });
      dispatch(fetchBusesRequest());
    }
  }, [loading, error, lastAction, dispatch]);

  return (
    <div className={styles.formContainer}>
      <h2 className="text-center mb-4">{form._id ? "Update Bus" : "Add New Bus"}</h2>
      <div className="d-flex justify-content-center">
        <form onSubmit={handleSubmit} className={styles.busForm}>
          <input
            type="text"
            name="busNumber"
            placeholder="Bus Number"
            value={form.busNumber}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="name"
            placeholder="Bus Name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="from"
            placeholder="From"
            value={form.from}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="to"
            placeholder="To"
            value={form.to}
            onChange={handleChange}
            required
          />

          <div className={styles.timeRow}>
            <input
              type="text"
              name="departure"
              placeholder="Departure (hh:mm)"
              value={form.departure}
              onChange={handleChange}
              required
            />
            <select
              name="amPmDeparture"
              value={form.amPmDeparture}
              onChange={handleChange}
            >
              <option value="AM">AM</option>
              <option value="PM">PM</option>
            </select>
          </div>

          <div className={styles.timeRow}>
            <input
              type="text"
              name="arrival"
              placeholder="Arrival (hh:mm)"
              value={form.arrival}
              onChange={handleChange}
              required
            />
            <select
              name="amPmArrival"
              value={form.amPmArrival}
              onChange={handleChange}
            >
              <option value="AM">AM</option>
              <option value="PM">PM</option>
            </select>
          </div>

          <input
            type="text"
            name="duration"
            placeholder="Duration"
            value={calculateDuration(
              form.departure,
              form.amPmDeparture,
              form.arrival,
              form.amPmArrival
            )}
            readOnly
          />
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            required
            min="0"
          />
          <input
            type="number"
            name="seats"
            placeholder="Seats Available"
            value={form.seats}
            onChange={handleChange}
            required
            min="0"
          />
          <input
            type="text"
            name="company"
            placeholder="Company"
            value={form.company}
            onChange={handleChange}
            required
          />

          <select
            name="busType"
            value={form.busType}
            onChange={handleChange}
            required
          >
            <option value="">Select Bus Type</option>
            {busTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          <fieldset className={styles.amenities}>
            <legend>Amenities</legend>
            {allAmenities.map((amenity) => (
              <label key={amenity}>
                <input
                  type="checkbox"
                  value={amenity}
                  checked={form.amenities.includes(amenity)}
                  onChange={handleAmenityChange}
                />
                {amenity}
              </label>
            ))}
          </fieldset>

          <button type="submit" className="btn btn-primary">
            {form._id ? "Update Bus" : "Add Bus"}
          </button>
        </form>
      </div>

      <h2 className="text-center mt-5">Bus List</h2>

      {loading && <p>Loading buses...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      <table className={`table table-bordered mt-3 ${styles.busTable}`}>
        <thead>
          <tr>
            <th>Bus Number</th>
            <th>Name</th>
            <th>From</th>
            <th>To</th>
            <th>Departure</th>
            <th>Arrival</th>
            <th>Duration</th>
            <th>Price</th>
            <th>Seats</th>
            <th>Company</th>
            <th>Bus Type</th>
            <th>Amenities</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {buses.length === 0 && (
            <tr>
              <td colSpan="13" className="text-center">
                No buses found
              </td>
            </tr>
          )}
          {buses.map((bus) => (
            <tr key={bus._id}>
              <td>{bus.busNumber}</td>
              <td>{bus.name}</td>
              <td>{bus.from}</td>
              <td>{bus.to}</td>
              <td>
                {bus.time} {bus.amPmDeparture}
              </td>
              <td>
                {bus.arrive} {bus.amPmArrival}
              </td>
              <td>{bus.duration}</td>
              <td>{bus.price}</td>
              <td>{bus.seats}</td>
              <td>{bus.company}</td>
              <td>{bus.busType}</td>
              <td>{bus.amenities.join(", ")}</td>
              <td>
                <button
                  className="btn btn-sm btn-warning me-2"
                  onClick={() => handleEdit(bus)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(bus._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageBuses;
