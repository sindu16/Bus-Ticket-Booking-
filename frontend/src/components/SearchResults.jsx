
import { useState, useEffect } from "react";
import styles from "./SearchResults.module.css";
import { FaBus, FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchBusesRequest } from "../ReduxSaga/busesSlice";

const allAmenities = [
  "WiFi",
  "AC",
  "Water Bottle",
  "LED TV & Music",
  "Charging Port",
  "Blanket"
];

  const SearchResults = () => {
  const dispatch = useDispatch();
  const { buses, loading } = useSelector((state) => state.buses);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [searched, setSearched] = useState(false);

  const allCompanies = [...new Set(buses.map((bus) => bus.company))];

  useEffect(() => {
    setSearched(true);
    dispatch(fetchBusesRequest());
  }, [dispatch]);

  const handleCompanyChange = (company) => {
    setSelectedCompanies((prev) =>
      prev.includes(company)
        ? prev.filter((c) => c !== company)
        : [...prev, company]
    );
  };

  const handleAmenityChange = (amenity) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    );
  };

  const filteredBusList = buses.filter((bus) => {
    const fromMatch =
      from === "" || bus.from.toLowerCase().includes(from.toLowerCase());
    const toMatch =
      to === "" || bus.to.toLowerCase().includes(to.toLowerCase());
    const companyMatch =
      selectedCompanies.length === 0 ||
      selectedCompanies.includes(bus.company);
   
    const amenitiesMatch =
  selectedAmenities.length === 0 ||
  (Array.isArray(bus.amenities) &&
    selectedAmenities.every((selected) =>
      bus.amenities.some(
        (a) => a.trim().toLowerCase() === selected.trim().toLowerCase()
      )
    ));

    const price = typeof bus.price === "number" ? bus.price : 0;
    const priceMatch = price >= priceRange[0] && price <= priceRange[1];

    return fromMatch && toMatch && companyMatch && amenitiesMatch && priceMatch;
  });

  const sortedFilteredBusList = filteredBusList.sort(
    (a, b) => a.price - b.price
  );

  return (
    <div className={`container-fluid ${styles.container}`}>
      <div className={`row ${styles.searchBar}`}>
        <div className="col-12 col-md-3 mb-2">
          <input
            className="form-control"
            placeholder="Origin..."
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          />
        </div>
        <div className="col-12 col-md-3 mb-2">
          <input
            className="form-control"
            placeholder="Destination..."
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
        </div>
        <div className="col-12 col-md-2 mb-2">
          <button className={styles.searchBtn}>
            Search
          </button>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-12 col-md-3 mb-4">
          <div className={styles.filters}>
            <h5>Apply Filters</h5>
            <p>Rs. {priceRange[0]} — Rs. {priceRange[1]}</p>
            <input
              type="range"
              className="form-range"
              min={0}
              max={1000}
              step={1}
              value={priceRange[1]}
              onChange={(e) => {
                const max = Number(e.target.value);
                if (!isNaN(max) && max >= priceRange[0]) {
                  setPriceRange([priceRange[0], max]);
                }
              }}
            />


            <div className={`${styles.filterBox} p-2`}>
              <h5 className="mb-3">Bus Companies</h5>
              <div className="row gx-2 gy-1">
                {allCompanies.map((company, i) => (
                  <div
                    className="col-12 col-sm-6 col-md-12"
                    key={`company-${company}-${i}`}
                  >
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id={`company-${company}`}
                        checked={selectedCompanies.includes(company)}
                        onChange={() => handleCompanyChange(company)}
                      />
                      <label
                        className="form-check-label ms-1"
                        htmlFor={`company-${company}`}
                      >
                        {company}
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={`${styles.filterBox} p-2`}>
              <h5 className="mb-3">Amenities</h5>
              <div className="row gx-2 gy-1">
                {allAmenities.map((amenity, i) => (
                  <div
                    className="col-12 col-sm-6 col-md-12"
                    key={`amenity-${amenity}-${i}`}
                  >
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id={`amenity-${amenity}`}
                        checked={selectedAmenities.includes(amenity)}
                        onChange={() => handleAmenityChange(amenity)}
                      />
                      <label
                        className="form-check-label ms-1"
                        htmlFor={`amenity-${amenity}`}
                      >
                        {amenity}
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-9">
          {loading && <p>Loading buses...</p>}
          {searched && sortedFilteredBusList.length === 0 ? (
            <p>No buses match your search and filter criteria.</p>
          ) : (
            sortedFilteredBusList.map((bus, idx) => (
              <div
                className={`row ${styles.busCard}`}
                key={bus._id || bus.id || idx}
              >
                <div className="col-4 mb-2">
                  <h5 className={styles.busName}>
                    <FaBus className="text-danger me-2" />
                    {bus.company}
                  </h5>
                 
                  <p className={styles.time}><strong>Start:</strong>  {bus.time} {bus.amPmDeparture}</p>
                  <p><strong>From:</strong> {bus.from}</p>
                  <p><strong>Duration:</strong> {bus.duration}</p>
                  <p><strong>Bus Type:</strong> {bus.busType}</p>
                  <p className="mt-2 text-success">
                    {bus.seats ? `${bus.seats} seats available` : "Seats info N/A"}
                  </p>
                  
                </div>

                <div className="col-4 d-flex justify-content-center align-items-center">
                  <FaBus className={styles.busIcon} />
                </div>

                <div className="col-4 mt-1">
                  <p className={styles.arrival}>
                     <p><strong>BusNo:</strong> {bus.busNumber}</p>
                    <strong>Arrival:</strong>  {bus.arrive} {bus.amPmArrival}
                  </p>
                  <p><strong>To:</strong> {bus.to}</p>
                  <p>
                    Rs. {bus.price} <span className="text-muted">/ per seat</span>
                  </p>
                  <div className="d-flex align-items-center gap-2 mt-2 flex-wrap">
                    {bus.amenities?.length ? (
                      bus.amenities.map((a, i) => (
                        <span key={i} className={styles.tag}>{a}</span>
                      ))
                    ) : (
                      <span className={styles.tag}>No amenities</span>
                    )}
                    <span className={styles.tag}>
                      <FaStar className="me-1" />4.5
                    </span>
                  </div>
                  <Link
                    to="/seats"
                    state={{
                      from: bus.from,
                      to: bus.to,
                      departure: bus.time ,
                      amPmDeparture:bus.amPmDeparture,
                      arrival: bus.arrive,
                      amPmArrival:bus.amPmArrival,
                      price: bus.price,
                      bus: bus.busNumber,
                      company: bus.company,
                      duration: bus.duration,
                      busType:bus.busType
                    }}
                    className={`mt-3 d-inline-block ${styles.reserveBtn}`}
                  >
                    Reserve Seat
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
