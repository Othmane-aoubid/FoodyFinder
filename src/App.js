import React, { useState, useEffect } from "react";
import axios from "axios";
import RestaurantList from "./components/ui/RestaurantList";
import RestaurantModal from "./components/ui/RestaurantModal";

export default function RestaurantFinder() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("");
  const [foodType, setFoodType] = useState("");
  const [cuisineType, setCuisineType] = useState("other");
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [notification, setNotification] = useState("");

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(storedFavorites);
  }, []);

  const API_KEY = "d653631d5cmsh0c80dc042132107p1e48e1jsnd35db403294e";
  const API_HOST = "google-map-scraper1.p.rapidapi.com";

  const searchRestaurants = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const query =
        `${searchTerm} ${location} ${foodType} ${cuisineType}`.trim();
      const response = await axios.get(
        `https://${API_HOST}/api/places/search`,
        {
          headers: {
            "X-Rapidapi-Key": API_KEY,
            "X-Rapidapi-Host": API_HOST,
          },
          params: { query },
        }
      );

      if (response.data && response.data.data && response.data.data.results) {
        setRestaurants(response.data.data.results);
        console.log("response.data.data.results ", response.data.data.results);
      } else {
        setError("No restaurants found. Please try a different search.");
      }
    } catch (err) {
      setError("Failed to fetch restaurants. Please try again.");
    }
    setLoading(false);
  };

  const toggleFavorite = (restaurant) => {
    console.log(`Toggling favorite for: ${restaurant.name}`);
    console.log("Current favorites:", favorites);

    const isFavorite = favorites.some((fav) => fav.id === restaurant.id);
    let updatedFavorites;

    if (isFavorite) {
      updatedFavorites = favorites.filter((fav) => fav.id !== restaurant.id);
      console.log(`Removed ${restaurant.name} from favorites.`);
    } else {
      updatedFavorites = [...favorites, restaurant];
      console.log(`Added ${restaurant.name} to favorites.`);
    }

    console.log("Updated favorites:", updatedFavorites);

    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    setTimeout(() => setNotification(""), 3000);
  };

  const filterRestaurants = (
    restaurants,
    searchTerm,
    location,
    foodType,
    cuisineType
  ) => {
    const lowerCaseTerm = searchTerm.toLowerCase();
    const lowerCaseLocation = location.toLowerCase();
    const lowerCaseFoodType = foodType.toLowerCase();
    const lowerCaseCuisineType = cuisineType.toLowerCase();

    return restaurants.filter((restaurant) => {
      const matchesName =
        restaurant.name &&
        restaurant.name.toLowerCase().includes(lowerCaseTerm);
      const matchesLocation =
        restaurant.location &&
        restaurant.location.toLowerCase().includes(lowerCaseLocation);
      const matchesFoodType =
        restaurant.foodType &&
        restaurant.foodType.toLowerCase().includes(lowerCaseFoodType);
      const matchesCuisineType =
        cuisineType === "other" ||
        (restaurant.cuisine &&
          restaurant.cuisine.toLowerCase().includes(lowerCaseCuisineType));
      return (
        matchesName || matchesLocation || matchesFoodType || matchesCuisineType
      );
    });
  };

  const filteredRestaurants = filterRestaurants(
    restaurants,
    searchTerm,
    location,
    foodType,
    cuisineType
  );

  return (
    <div className="p-4 max-w-4xl mx-auto relative">
      {notification && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded shadow-lg">
          {notification}
        </div>
      )}

      <button
        onClick={() => setShowFavorites(!showFavorites)}
        className="bg-green-500 text-white rounded px-4 py-2 mb-4"
      >
        {showFavorites ? "Close Favorites" : "Favorites"}
      </button>

      {showFavorites && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white border shadow-lg p-4 w-80 relative">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-black"
              onClick={() => setShowFavorites(false)}
            >
              ×
            </button>
            <h2 className="text-lg font-bold mb-2">My Favorites</h2>
            {favorites.length > 0 ? (
              <ul>
                {favorites.map((fav) => (
                  <li key={fav.id} className="border-b p-2">
                    <div className=" items-center">
                      <img
                        src={fav.cover_photo}
                        alt={fav.name}
                        className="w-16 h-16 object-cover rounded mr-4"
                      />
                      <div>
                        <h3 className="font-bold">{fav.name}</h3>
                        <p className="text-sm text-gray-500">{fav.address}</p>
                        <p className="text-sm text-gray-500">
                          Phone: {fav.phone_number || "N/A"}
                        </p>
                        <p className="text-sm text-gray-500">
                          Rating: {fav.rating} ★
                        </p>
                        <p className="text-sm text-gray-500">
                          {fav.reviews} reviews
                        </p>
                        <p className="text-sm text-gray-500">
                          Status: {fav.status || "Unknown"}
                        </p>
                        <p className="text-sm text-gray-500">
                          Website:{" "}
                          {fav.website ? (
                            <a
                              href={fav.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500"
                            >
                              Visit
                            </a>
                          ) : (
                            "N/A"
                          )}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleFavorite(fav)}
                      className="text-red-500 mt-2"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No favorites added yet.</p>
            )}
          </div>
        </div>
      )}

      <form
        onSubmit={searchRestaurants}
        className="flex flex-col md:flex-row gap-4"
      >
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by restaurant name"
          className="border p-2 rounded flex-1"
        />
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Enter location (e.g., Casablanca)"
          className="border p-2 rounded flex-1"
        />
        <input
          type="text"
          value={foodType}
          onChange={(e) => setFoodType(e.target.value)}
          placeholder="Enter food type (e.g., Sushi)"
          className="border p-2 rounded flex-1"
        />
        <select
          value={cuisineType}
          onChange={(e) => setCuisineType(e.target.value)}
          className="border p-2 rounded flex-1"
        >
          <option value="other">Other (Show All)</option>
          <option value="american">American</option>
          <option value="italian">Italian</option>
          <option value="japanese">Japanese</option>
          <option value="chinese">Chinese</option>
          <option value="turkish">Turkish</option>
          <option value="indian">Indian</option>
          <option value="mexican">Mexican</option>
        </select>
        <button
          type="submit"
          className="bg-blue-500 text-white rounded px-4 py-2"
        >
          Search
        </button>
      </form>

      {loading && <p className="mt-4">Loading...</p>}
      {error && <p className="mt-4 text-red-500">{error}</p>}

      {filteredRestaurants.length > 0 ? (
        <RestaurantList
          restaurants={filteredRestaurants}
          onSelect={(restaurant) => setSelectedRestaurant(restaurant)}
          onToggleFavorite={toggleFavorite}
          favorites={favorites}
        />
      ) : (
        <p className="mt-4">No restaurants found matching your search.</p>
      )}

      {selectedRestaurant && (
        <RestaurantModal
          restaurant={selectedRestaurant}
          onClose={() => setSelectedRestaurant(null)}
        />
      )}
    </div>
  );
}
