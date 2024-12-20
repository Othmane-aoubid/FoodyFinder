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

export default function RestaurantFinder() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lat, setLat] = useState("37.7786357"); // Default lat
  const [lng, setLng] = useState("-122.3918135"); // Default lng
  const [searchTerm, setSearchTerm] = useState("");

  const searchRestaurants = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `https://api.spoonacular.com/food/restaurants/search?apiKey=1d26c536698646549c56916dbbdd2999&query=${searchTerm}&lat=${lat}&lng=${lng}`
      );

      console.log(response.data);

      // Map the Spoonacular API response structure
      const restaurants = response.data.restaurants.map((item) => ({
        id: item._id,
        name: item.name,
        image_url: item.image_url || "default-restaurant-image.jpg",
        rating: item.weighted_rating_value || 0,
        review_count: item.reviews_count || 0,
        price: item.price_range || "$$",
        categories: [{ title: item.cuisine || "Various" }],
        location: {
          address1: `${item.address.street_addr}, ${item.address.city}, ${item.address.state} ${item.address.zipcode}`,
        },
        phone: item.phone_number || "-",
        url: item.website || "#",
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
                  onChange={(e) => setSearchTerm(e.target.value)}
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
                    onChange={(e) => setLat(e.target.value)}
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
                    onChange={(e) => setLng(e.target.value)}
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

        {/* Restaurant Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {restaurants.map((restaurant) => (
            <Card
              key={restaurant.id}
              className="overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="relative">
                <img
                  src={restaurant.image_url}
                  alt={restaurant.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-0 right-0 bg-blue-600 text-white px-3 py-1 rounded-bl-lg">
                  {restaurant.price || "$$"}
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-2xl hover:text-blue-600 transition-colors">
                  {restaurant.name}
                </CardTitle>
                <div className="flex items-center">
                  <div className="flex text-yellow-400">
                    {[...Array(Math.round(restaurant.rating))].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-gray-600 ml-2 text-sm">
                    ({restaurant.review_count} reviews)
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-gray-600">
                  <div className="flex items-center">
                    <Utensils className="mr-2 text-blue-600 h-4 w-4" />
                    <span>
                      {restaurant.categories.map((c) => c.title).join(", ")}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="mr-2 text-blue-600 h-4 w-4" />
                    <span>{restaurant.location.address1}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="mr-2 text-blue-600 h-4 w-4" />
                    <span>{restaurant.phone}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <a
                    href={restaurant.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View on Yelp
                  </a>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* No Results Message */}
        {!loading && restaurants.length === 0 && (
          <div className="text-center py-16">
            <div className="text-gray-400 text-6xl mb-4">
              <Utensils className="mx-auto h-16 w-16" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No restaurants found
            </h3>
            <p className="text-gray-500">
              Try searching for a location to discover great restaurants!
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
