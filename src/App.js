"use client";

import React, { useState } from "react";
import axios from "axios";
import { Utensils, MapPin, Loader2, Star, Phone, Search } from "lucide-react";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import  RestaurantList  from "./components/ui/RestaurantList";

export default function RestaurantFinder() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lat, setLat] = useState(
    () => localStorage.getItem("lat") || "37.7786357"
  );
  const [lng, setLng] = useState(
    () => localStorage.getItem("lng") || "-122.3918135"
  );
  const [searchTerm, setSearchTerm] = useState(
    () => localStorage.getItem("searchTerm") || ""
  );

  const handleLatChange = (e) => {
    const value = e.target.value;
    setLat(value);
    localStorage.setItem("lat", value);
  };

  const handleLngChange = (e) => {
    const value = e.target.value;
    setLng(value);
    localStorage.setItem("lng", value);
  };

  const handleSearchTermChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    localStorage.setItem("searchTerm", value);
  };

  const searchRestaurants = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `https://api.spoonacular.com/food/restaurants/search?apiKey=1d26c536698646549c56916dbbdd2999&query=${searchTerm}&lat=${lat}&lng=${lng}`
      );

      console.log(response.data);

      // Map the API response to include the correct image URLs
      const restaurants = response.data.restaurants.map((item) => ({
        _id: item._id,
        name: item.name,
        food_photos: item.food_photos || [],
        logo_photos: item.logo_photos || [],
        store_photos: item.store_photos || [],
        weighted_rating_value: item.weighted_rating_value || 0,
        dollar_signs: item.dollar_signs || 2,
        cuisines: item.cuisines || ["Various"],
        address: item.address || {},
        phone_number: item.phone_number || "-",
      }));

      setRestaurants(restaurants);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch restaurants. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 shadow-xl">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white text-center mb-4">
            Foodie Finder
          </h1>
          <p className="text-blue-100 text-center text-lg mb-8">
            Discover amazing restaurants in your area
          </p>

          {/* Search Form */}
          <form onSubmit={searchRestaurants} className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4 p-4 bg-white rounded-xl shadow-lg">
              <div className="flex-1 relative">
                <Utensils className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search for cuisine or restaurant..."
                  value={searchTerm}
                  onChange={handleSearchTermChange}
                  className="pl-10"
                />
              </div>
              <div className="flex-1 flex gap-2">
                <div className="flex-1 relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    type="number"
                    step="any"
                    placeholder="Latitude (e.g., 37.7786357)"
                    value={lat}
                    onChange={handleLatChange}
                    className="pl-10"
                    required
                  />
                </div>
                <div className="flex-1 relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    type="number"
                    step="any"
                    placeholder="Longitude (e.g., -122.3918135)"
                    value={lng}
                    onChange={handleLngChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <Button
                type="submit"
                className="w-full md:w-auto"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Search className="mr-2 h-4 w-4" />
                )}
                Search
              </Button>
            </div>
          </form>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Error Message */}
        {error && (
          <div
            className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-8 rounded"
            role="alert"
          >
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-8">
            <Loader2 className="h-8 w-8 animate-spin mx-auto" />
            <p className="mt-2 text-gray-600">Loading restaurants...</p>
          </div>
        )}

        {/* Restaurant List */}
        {!loading && !error && restaurants.length > 0 && (
          <RestaurantList restaurants={restaurants} />
        )}

        {/* No Results */}
        {!loading && !error && restaurants.length === 0 && (
          <div className="text-center py-8 text-gray-600">
            No restaurants found. Try adjusting your search.
          </div>
        )}
      </main>
    </div>
  );
}
