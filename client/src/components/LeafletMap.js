import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css"; // Import Leaflet CSS
import L from "leaflet";

// Fix the default marker icon issue in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const MapView = ({ farmers, buyerPosition }) => {
  // Function to find the nearest farmer to the buyer
  const findNearestFarmer = (farmers) => {
    let nearest = null;
    let minDistance = Infinity;

    farmers.forEach((farmer) => {
      const distance = L.latLng(buyerPosition).distanceTo(L.latLng(farmer.latitude, farmer.longitude));
      if (distance < minDistance) {
        minDistance = distance;
        nearest = { ...farmer, distance: distance };
      }
    });

    return nearest;
  };

  const nearestFarmer = findNearestFarmer(farmers);

  return (
    <MapContainer center={buyerPosition} zoom={13} style={{ height: "500px", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={buyerPosition}>
        <Popup>Your Location</Popup>
      </Marker>

      {farmers.map((farmer, index) => (
        <Marker key={index} position={[farmer.latitude, farmer.longitude]}>
          <Popup>
            {farmer.name}
            <br />
            {farmer.crop}
          </Popup>
        </Marker>
      ))}

      {nearestFarmer && (
        <>
          <Polyline
            positions={[buyerPosition, [nearestFarmer.latitude, nearestFarmer.longitude]]}
            color="blue"
            weight={4}
          />
          <div
            style={{
              position: "absolute",
              top: "10px",
              left: "10px",
              backgroundColor: "white",
              padding: "5px",
              borderRadius: "5px",
            }}
          >
            Nearest Farmer: {nearestFarmer.name}
            <br />
            Distance: {(nearestFarmer.distance / 1000).toFixed(2)} km
          </div>
        </>
      )}
    </MapContainer>
  );
};

const MapComp = () => {
  const [farmers, setFarmers] = useState([]);
  const [buyerPosition, setBuyerPosition] = useState(null);

  useEffect(() => {
    const fetchFarmers = async () => {
       const mockFarmersData = [
         { latitude: 13.3391, longitude: 77.1010, name: "Farmer A", crop: "Wheat" },
         { latitude: 13.3441, longitude: 77.1090, name: "Farmer B", crop: "Corn" },
         { latitude: 13.3301, longitude: 77.0950, name: "Farmer C", crop: "Rice" },
       ];

      setTimeout(() => {
        setFarmers(mockFarmersData);
      }, 1000);
    };

    fetchFarmers();
  }, []);




console.log();

   useEffect(() => {
    const longitude = localStorage.getItem("longitude");
const latitude = localStorage.getItem("latitude");
     if (longitude && latitude) {

      
      
       setBuyerPosition([latitude,longitude]);  
     } else {
       alert("Location data is missing in localStorage.");
     }
   }, []);

  const token = localStorage.getItem("token");

  if (!token) {
    return <p>Please log in as a buyer to view this page.</p>;
  }

  return (
    <div>
      <h1>Farmers Near You</h1>
      {buyerPosition ? (
        <MapView farmers={farmers} buyerPosition={buyerPosition} />
      ) : (
        <p>Loading your location...</p>
      )}
    </div>
  );
};

export default MapComp;
