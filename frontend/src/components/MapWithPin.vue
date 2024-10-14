<template>
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
import supabase from "@/supabaseClient"; // Import Supabase client

// Props definition
const props = defineProps({
  containerHeight: {
    type: String,
    default: "70vh",
  },
  containerWidth: {
    type: String,
    default: "100%",
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

// Emit event for marker-added
const emit = defineEmits(['location-changed']);

// State variables
const map = ref(null);
const marker = ref(null);
const shelters = ref([]); // Add shelters array to store fetched data
const user_lat = ref(7.1907);
const user_long = ref(125.4553);
const zoomLevel = 7;
const marked_address = ref("");
const mapId = `map-${Math.random().toString(36).substr(2, 9)}`;
const pawIcon = L.icon({
  iconUrl: paw,
  iconSize: [100, 100],
  iconAnchor: [19, 38],
  popupAnchor: [0, -38],
});

// Initialize map on component mount
onMounted(async () => {
  await fetchShelters(); // Fetch shelter data from Supabase
  getLocation();
});

// Clean up map when the component is unmounted
onBeforeUnmount(() => {
  if (map.value) {
    map.value.off();
    map.value.remove();
    map.value = null;
  }
});

// Function to fetch shelters data from Supabase
const fetchShelters = async () => {
  try {
    const { data, error } = await supabase
      .from('tbl_shelter')
      .select('shelter_name, shelter_address, latitude, longitude');

    if (error) throw error;
    shelters.value = data; // Set the fetched data to shelters array
  } catch (error) {
    console.error("Error fetching shelter data:", error.message);
  }
};

// Initialize the map function
const initializeMap = (lat, lng) => {
  if (map.value) {
    map.value.setView([lat, lng], zoomLevel);
    return;
  }

  map.value = L.map(mapId).setView([lat, lng], zoomLevel);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "© OpenStreetMap",
  }).addTo(map.value);

  map.value.addControl(new L.Control.Fullscreen());
  map.value.on("click", addMarker);

  // Add markers for each shelter
  shelters.value.forEach(shelter => {
    const shelterMarker = L.marker([shelter.latitude, shelter.longitude], { icon: pawIcon }).addTo(map.value);
    shelterMarker.bindPopup(`<strong>${shelter.shelter_name}</strong><br>${shelter.shelter_address}`);
  });
};

// Add marker function for manual map clicks
const addMarker = async (e) => {
  if (marker.value) {
    map.value.removeLayer(marker.value);
  }

  const lat = e?.latlng ? e.latlng.lat : user_lat.value;
  const lng = e?.latlng ? e.latlng.lng : user_long.value;

  user_lat.value = lat;
  user_long.value = lng;

  marker.value = L.marker([lat, lng], { icon: pawIcon }).addTo(map.value);

  const address = await getAddress(lat, lng);
  if (address) {
    marker.value.bindPopup(`Address: ${address}`).openPopup();
  } else {
    marker.value.bindPopup(`Coordinates: ${lat}, ${lng}`).openPopup();
  }

  // Emit the location-changed event
  emit('location-changed', {
    address: marked_address.value,
    lat: user_lat.value,
    lng: user_long.value,
  });
};

// Get user's current location and initialize the map
const getLocation = () => {
  if (props.shelterlat && props.shelterlng) {
    initializeMap(props.shelterlat, props.shelterlng);
    addMarker({
      latlng: { lat: props.shelterlat, lng: props.shelterlng },
    });
  } else if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        user_lat.value = position.coords.latitude;
        user_long.value = position.coords.longitude;
        initializeMap(user_lat.value, user_long.value);
        addMarker({
          latlng: { lat: user_lat.value, lng: user_long.value },
        });
      },
      () => {
        console.warn("Geolocation access denied or failed. Using default location.");
        initializeMap(user_lat.value, user_long.value);
      }
    );
  } else {
    console.warn("Geolocation is not supported by this browser. Using default location.");
    initializeMap(user_lat.value, user_long.value);
  }
};

// Fetch the address using reverse geocoding
const getAddress = async (lat, lon) => {
  const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`;

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Furry-Safe/1.0 (jinnkin21@gmail.com)",
      },
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    marked_address.value = data.display_name;
    return data.display_name;
  } catch (error) {
    console.error("Error fetching address:", error);
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
