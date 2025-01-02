"use client";

import React, { useState } from "react";
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
  const [cuisineType, setCuisineType] = useState("");
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);

  const API_KEY = "d653631d5cmsh0c80dc042132107p1e48e1jsnd35db403294e";
  const API_HOST = "google-map-scraper1.p.rapidapi.com";

  const searchRestaurants = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const query = `${searchTerm} ${location} ${foodType} ${cuisineType}`.trim();
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
        console.log("API Response:", response.data.data.results);
        setRestaurants(response.data.data.results);
      } else {
        setError("No restaurants found. Please try a different search.");
      }
    } catch (err) {
      console.error("API Error:", err);
      setError("Failed to fetch restaurants. Please try again.");
    }
    setLoading(false);
  };

  const getRestaurantDetails = async (placeId) => {
    try {
      const response = await axios.get(
        `https://${API_HOST}/api/place/detail`,
        {
          headers: {
            "X-Rapidapi-Key": API_KEY,
            "X-Rapidapi-Host": API_HOST,
          },
          params: { place: placeId },
        }
      );

      if (response.data && response.data.data) {
        setSelectedRestaurant(response.data.data);
      } else {
        setError("Failed to fetch restaurant details.");
      }
    } catch (err) {
      console.error("Details API Error:", err);
      setError("Failed to fetch restaurant details. Please try again.");
    }
  };

  const filterRestaurants = (restaurants, searchTerm, location, foodType, cuisineType) => {
    const lowerCaseTerm = searchTerm.toLowerCase();
    const lowerCaseLocation = location.toLowerCase();
    const lowerCaseFoodType = foodType.toLowerCase();
    const lowerCaseCuisineType = cuisineType.toLowerCase();

    return restaurants.filter((restaurant) => {
      const matchesName = restaurant.name && restaurant.name.toLowerCase().includes(lowerCaseTerm);
      const matchesLocation = restaurant.location && restaurant.location.toLowerCase().includes(lowerCaseLocation);
      const matchesFoodType = restaurant.foodType && restaurant.foodType.toLowerCase().includes(lowerCaseFoodType);
      const matchesCuisineType = restaurant.cuisine && restaurant.cuisine.toLowerCase().includes(lowerCaseCuisineType);
      return matchesName || matchesLocation || matchesFoodType || matchesCuisineType;
    });
  };

  const filteredRestaurants = filterRestaurants(restaurants, searchTerm, location, foodType, cuisineType);

  return (
    <div className="p-4 max-w-4xl mx-auto">
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
          <option value="">Select Cuisine Type</option>
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
          onSelect={(restaurant) => getRestaurantDetails(restaurant.place_id)}
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
