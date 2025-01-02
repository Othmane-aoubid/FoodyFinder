import React from "react";

const RestaurantList = ({ restaurants, onSelect }) => {
  return (
    <div className="mt-8">
      {restaurants.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">
          No restaurants found.
        </p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map((restaurant) => (
            <li
              key={restaurant.id}
              className="border rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="relative">
                <img
                  src={restaurant.cover_photo}
                  alt={restaurant.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded text-sm shadow">
                  {restaurant.rating} ★
                </div>
              </div>
              <div className="p-4">
                <h2 className="text-xl font-bold mb-2">{restaurant.name}</h2>
                <p className="text-gray-600 text-sm">{restaurant.address}</p>
                <p className="text-sm text-gray-500 mt-2">
                  {restaurant.reviews} reviews
                </p>
                <button
                  onClick={() => onSelect(restaurant)}
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full transition"
                >
                  View Details
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RestaurantList;
