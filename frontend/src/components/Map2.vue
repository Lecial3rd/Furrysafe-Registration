<template>
  <div class="map-container" :style="{ height: containerHeight, width: containerWidth }" :id="mapId"></div>
</template>

<script setup>
import { ref, shallowRef, onMounted, onBeforeUnmount} from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-fullscreen';
import 'leaflet-fullscreen/dist/leaflet.fullscreen.css';
import paw from '@/assets/images/pawcator-icon-beta.png';

// Props definition
const props = defineProps({
  containerHeight: {
    type: String,
    default: '70vh',
  },
  containerWidth: {
    type: String,
    default: '100%',
  },
  shelterlat: {
    type: Number,
    required: false,
  },
  shelterlng: {
    type: Number,
    required: false,
  },
});

// State variables
const map = shallowRef(null); // Use shallowRef for the map
const userMarker = shallowRef(null); // Use shallowRef for user marker
const shelterMarkers = ref([]); // Store all shelter markers in a ref
const shelters = ref([]);
const user_lat = ref(7.1907); // Default to Davao City
const user_long = ref(125.4553); // Default to Davao City
const zoomLevel = 8;
const mapId = `map-${Math.random().toString(36).substr(2, 9)}`;
const pawIcon = L.icon({
  iconUrl: paw,
  iconSize: [100, 100],
  iconAnchor: [19, 38],
  popupAnchor: [0, -38],
});

// Clean up function for the map on unmount
onBeforeUnmount(() => {
  if (map.value) {
    console.log("Cleaning up map...");
    map.value.off(); // Remove all event listeners
    shelterMarkers.value.forEach(shelterMarker => {
      map.value.removeLayer(shelterMarker); // Remove shelter markers
    });
    if (userMarker.value) {
      map.value.removeLayer(userMarker.value); // Remove user marker if exists
    }
    map.value.remove(); // Remove the map instance
    map.value = null; // Clean up reference
  }
});

// Initialize the map on mount
onMounted(() => {
  console.log("Mounting the map...");
  initializeMap();
  getLocation();
});

// Function to initialize the map
const initializeMap = () => {
  if (!map.value) {
    const lat = props.shelterlat || user_lat.value;
    const lng = props.shelterlng || user_long.value;

    console.log(`Initializing map at: ${lat}, ${lng}`);
    map.value = L.map(mapId).setView([lat, lng], zoomLevel);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap',
    }).addTo(map.value);

    map.value.addControl(new L.Control.Fullscreen());

    // Fetch shelters after the map has been initialized
    fetchShelters();

    // Add click listener to the map for adding user marker
    map.value.on('click', addMarker);
  }
};

const getLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        user_lat.value = position.coords.latitude;
        user_long.value = position.coords.longitude;
        initializeMap(user_lat.value, user_long.value);
        addMarker({ latlng: { lat: user_lat.value, lng: user_long.value } });
      },
      () => {
        console.warn("Geolocation access denied. Using default location.");
        initializeMap(user_lat.value, user_long.value);
      });
  } else {
    console.log("current position else")
    initializeMap(user_lat.value, user_long.value);
  }
};

// Fetch shelter data and add markers to the map
const fetchShelters = async () => {
  try {
    const response = await fetch('http://localhost:5000/shelters');
    const data = await response.json();

    if (Array.isArray(data)) {
      shelters.value = data;
      console.log("Shelters fetched:", shelters.value);
      updateShelterMarkers(); // Add markers to map after fetching
    }
  } catch (error) {
    console.error("Error fetching shelter data:", error);
  }
};

// Update shelter markers on the map
const updateShelterMarkers = () => {
  console.log("Updating shelter markers...");

  // Clear existing markers before adding new ones
  shelterMarkers.value.forEach(shelterMarker => {
    shelterMarker.off(); // Remove all event listeners from the marker
    map.value.removeLayer(shelterMarker); // Remove shelter markers
  });

  shelterMarkers.value = []; // Clear the marker array

  shelters.value.forEach(shelter => {
    const lat = parseFloat(shelter.latitude);
    const lng = parseFloat(shelter.longitude);

    if (!isNaN(lat) && !isNaN(lng)) {
      const shelterMarker = L.marker([lat, lng], { icon: pawIcon }).addTo(map.value);

      // Create and bind the popup content once when the marker is created
      const popupContent = `
                <strong>${shelter.shelter_name}</strong><br>
                Address: ${shelter.address || 'Address not available'}
            `;
      shelterMarker.bindPopup(popupContent);

      // Handle marker click event
      shelterMarker.on('click', (e) => {
        // Prevent the zoomend event from firing on marker click
        e.originalEvent.stopPropagation();

        // Remove user marker if it exists
        if (userMarker.value) {
          map.value.removeLayer(userMarker.value);
          userMarker.value = null;
        }

        // Close any open popups for other markers
        shelterMarkers.value.forEach(marker => {
          if (marker !== shelterMarker) {
            marker.closePopup(); // Close the popups of other markers
          }
        });

        // Open the popup for the clicked shelter marker
        shelterMarker.openPopup();
      });

      shelterMarkers.value.push(shelterMarker); // Add to the shelterMarkers array
    }
  });

  console.log("Shelter markers after adding:", shelterMarkers.value);
};

const emit = defineEmits(['location-changed']);
// Add a marker on user click
const addMarker = async (e) => {
  console.log("Adding user marker at:", e.latlng);

  // Clear previous user marker if exists
  if (userMarker.value) {
    console.log("Removing previous user marker...");
    map.value.removeLayer(userMarker.value);
  }

  const lat = e.latlng.lat;
  const lng = e.latlng.lng;

  userMarker.value = L.marker([lat, lng], { icon: pawIcon }).addTo(map.value);

  // Fetch address using reverse geocoding
  const address = await getAddress(lat, lng);
  userMarker.value.bindPopup(`Address: ${address}`).openPopup();

  emit('location-changed', { address, lat: user_lat.value, lng: user_long.value });
};

// Fetch the address using reverse geocoding
const getAddress = async (lat, lon) => {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`; // Ensure proper format
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Furry-Safe/1.0 (jinnkin21@gmail.com)', // Corrected header
      },
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data.display_name;
  } catch (error) {
    console.error('Error fetching address:', error);
    return null;
  }
};
</script>

<style scoped>
.map-container {
  height: 70vh;
  width: 100%;
  position: relative;
  z-index: 1;
  overflow: hidden;
}

.modal-wrapper {
  z-index: 1050;
  position: relative;
}

address-display {
  z-index: 1051;
  margin-bottom: 10px;
}
</style>

<!-- <template>
    <div class="map-container" :style="{ height: containerHeight, width: containerWidth }" :id="mapId"></div>
  </template>
  
  <script setup>
  import { ref, onMounted, onBeforeUnmount } from 'vue';
  import L from "leaflet";
  import "leaflet/dist/leaflet.css";
  import "leaflet-fullscreen";
  import "leaflet-fullscreen/dist/leaflet.fullscreen.css";
  import paw from "@/assets/images/pawcator-icon-beta.png";
  import "leaflet-control-geocoder";
  
  // Props definition
  const props = defineProps({
    containerHeight: { type: String, default: "70vh" },
    containerWidth: { type: String, default: "100%" },
    shelterlat: { type: Number, required: false },
    shelterlng: { type: Number, required: false },
  });
  
  // Emit event for marker-added
  const emit = defineEmits(['location-changed']);
  
  // State variables
  const map = ref(null);
  const marker = ref(null);
  const user_lat = ref(10.3157);
  const user_long = ref(123.8854);
  const zoomLevel = 17;
  const marked_address = ref("");
  const mapId = `map-${Math.random().toString(36).substr(2, 9)}`;
  const pawIcon = L.icon({
    iconUrl: paw,
    iconSize: [100, 100],
    iconAnchor: [19, 38],
    popupAnchor: [0, -38],
  });
  
  
  delete L.Icon.Default.prototype._getIconUrl;
  
  L.Icon.Default.mergeOptions({
    iconUrl: paw,
    iconRetinaUrl: paw,
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
  });
  
  // Function to fetch shelter data from backend
  const fetchShelters = async () => {
    try {
      const response = await fetch('http://localhost:5000/shelters');
      const data = await response.json();
      addShelterMarkers(data);  // Add new markers
    } catch (error) {
      console.error("Error fetching shelter data:", error);
    }
  };
  
  // Function to fetch nearby hotspots like malls and gas stations
  const fetchHotspots = async () => {
    const radius = 5000; // Radius in meters
  
    const query = `
      [out:json];
      (
        node["amenity"="mall"](around:${radius}, ${user_lat.value}, ${user_long.value});
        node["amenity"="fuel"](around:${radius}, ${user_lat.value}, ${user_long.value});
      );
      out body;
    `;
  
    const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;
  
    try {
      const response = await fetch(url);
      const data = await response.json();
      displayHotspots(data.elements);
    } catch (error) {
      console.error("Error fetching hotspots:", error);
    }
  };
  
  const addShelterMarkers = (shelters) => {
    shelters.forEach((shelter) => {
      const lat = parseFloat(shelter.latitude);
      const lng = parseFloat(shelter.longitude);
      if (!isNaN(lat) && !isNaN(lng)) {
        console.log("lat lng:", lat, lng)
        const shelterMarker = L.marker([lat, lng], { icon: pawIcon }).addTo(map.value);
  
        // Define the content to display when marker is clicked
        const popupContent = `
          <div>
            <strong>${shelter.shelter_name}</strong><br>
            Address: ${shelter.address || 'Address not available'}
          </div>
        `;
  
        // Add click event to show details
        const onClick = () => {
          console.log("tite")
          // // Set popup content and open it
          // shelterMarker.bindPopup(popupContent).openPopup();
  
          // // Emit the shelter details if needed for another part of your app
          emit('show-shelter-details', {
            name: shelter.shelter_name,
            address: shelter.address || 'Address not available',
            lat: lat,
            lng: lng
          });
  
          shelterMarker.bindPopup(popupContent).openPopup();
          console.log("baba", lat, lng)
        };
  
        // Attach the click event listener
        shelterMarker.on("click", onClick);
  
        // Store the marker and its associated event listener for later cleanup
        shelterMarker._onClick = onClick; // Store reference to the function
      }
    });
  };
  
  const clearMarkers = () => {
    if (marker.value) {
      // Remove the marker from the map
      map.value.removeLayer(marker.value);
      marker.value.off(); // Remove all event listeners from the marker
      marker.value = null; // Clear the marker reference
    }
  
    // Assuming you have a way to track all shelter markers
    // You would loop through them and clean them up similarly
    // For example, if you stored them in an array:
    shelters.forEach((shelterMarker) => {
      if (shelterMarker._onClick) {
        shelterMarker.off("click", shelterMarker._onClick); // Remove click listener
      }
      map.value.removeLayer(shelterMarker); // Remove the marker from the map
    });
  };
  
  // Function to display hotspots on the map
  const displayHotspots = (hotspots) => {
    hotspots.forEach((place) => {
      const hotspotMarker = L.marker([place.lat, place.lon]).addTo(map.value);
      hotspotMarker.bindPopup(`
        <strong>${place.tags.name || 'Hotspot'}</strong><br>
        Type: ${place.tags.amenity}
      `);
    });
  };
  
  // Initialize the map function
  const initializeMap = (lat, lng) => {
    if (!map.value) {
      console.log("Initializing map for the first time");
      map.value = L.map(mapId).setView([lat, lng], zoomLevel);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19
      }).addTo(map.value);
      map.value.addControl(new L.Control.Fullscreen());
      map.value.on("click", addMarker);
    } else {
      console.log("Updating map view");
      map.value.setView([lat, lng], zoomLevel);
    }
  };
  
  
  // Add marker function
  const addMarker = async (e) => {
    if (!map.value) return; // Ensure map is initialized
  
    if (marker.value) {
      map.value.removeLayer(marker.value);
    }
  
    const lat = e?.latlng ? e.latlng.lat : user_lat.value;
    const lng = e?.latlng ? e.latlng.lng : user_long.value;
  
    user_lat.value = lat;
    user_long.value = lng;
  
    // Create a new marker and add it to the map
    marker.value = L.marker([lat, lng], { icon: pawIcon }).addTo(map.value);
  
    const address = await getAddress(lat, lng);
    marker.value.bindPopup(`Address: ${address || `Coordinates: ${lat}, ${lng}`}`).openPopup();
  
    emit('location-changed', { address, lat: user_lat.value, lng: user_long.value });
  };
  
  // Get user's current location
  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          user_lat.value = position.coords.latitude;
          user_long.value = position.coords.longitude;
          initializeMap(user_lat.value, user_long.value);
          addMarker({ latlng: { lat: user_lat.value, lng: user_long.value } });
        },
        () => {
          console.warn("Geolocation access denied. Using default location.");
          initializeMap(user_lat.value, user_long.value);
        });
    } else {
      console.log("current position else")
      initializeMap(user_lat.value, user_long.value);
    }
  };
  
  // Fetch address with reverse geocoding
  const getAddress = async (lat, lon) => {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      marked_address.value = data.display_name;
      return data.display_name;
    } catch (error) {
      console.error("Error fetching address:", error);
      return null;
    }
  };
  
  
  // Initialize map on component mount
  onMounted(async () => {
    getLocation();  // This will eventually call initializeMap within getLocation
    await new Promise((resolve) => {
      const checkMapInterval = setInterval(() => {
        if (map.value) {
          clearInterval(checkMapInterval);
          resolve();
        }
      }, 50);
    });
  
    await fetchShelters();  // Fetch shelter data after getting user location
    await fetchHotspots();  // Fetch nearby hotspots after setting up the map
  });
  
  // Clean up map when the component is unmounted
  onBeforeUnmount(() => {
    if (map.value) {
      map.value.off();
      map.value.remove();
      map.value = null;
    }
  });
  
  </script>
  
  <style scoped>
  .map-container {
    height: 70vh;
    width: 100%;
    position: relative;
    z-index: 1;
    overflow: hidden;
  }
  </style> -->