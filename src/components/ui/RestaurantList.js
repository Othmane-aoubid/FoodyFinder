import { useState } from "react";
import { Star, MapPin, Phone } from "lucide-react"; // Make sure to install lucide-react

export default function RestaurantList({ restaurants }) {
  const [imageError, setImageError] = useState({});

  const getDollarSigns = (count) => {
    return "$".repeat(count || 2);
  };

  const getFirstValidImage = (restaurant) => {
    if (imageError[restaurant._id]) {
      return "/default-restaurant-image.jpg";
    }

    const allPhotos = [
      ...(restaurant.food_photos || []),
      ...(restaurant.logo_photos || []),
      ...(restaurant.store_photos || []),
    ];

    return allPhotos[0] || "/default-restaurant-image.jpg";
  };

  const handleImageError = (restaurantId) => {
    setImageError((prev) => ({
      ...prev,
      [restaurantId]: true,
    }));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {restaurants.map((restaurant) => (
        <div
          key={restaurant._id}
          className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
        >
          <div className="relative h-48 overflow-hidden">
            <img
              src={getFirstValidImage(restaurant)}
              alt={restaurant.name}
              onError={() => handleImageError(restaurant._id)}
              className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute top-0 right-0 m-2 px-2 py-1 bg-white/90 rounded-full">
              <span className="text-green-600 font-semibold">
                {getDollarSigns(restaurant.dollar_signs)}
              </span>
            </div>
          </div>

          <div className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-bold text-gray-800 truncate">
                {restaurant.name}
              </h3>
              <div className="flex items-center">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <span className="ml-1 text-gray-700">
                  {restaurant.weighted_rating_value?.toFixed(1) || "N/A"}
                </span>
              </div>
            </div>

            <div className="mb-3">
              <p className="text-sm text-gray-600 line-clamp-2">
                {restaurant.cuisines?.join(", ")}
              </p>
            </div>

            {restaurant.address?.street_addr && (
              <div className="flex items-start gap-2 mb-2">
                <MapPin className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                <p className="text-sm text-gray-600 line-clamp-2">
                  {restaurant.address.street_addr}, {restaurant.address.city}
                </p>
              </div>
            )}

            {restaurant.phone_number && (
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400" />
                <p className="text-sm text-gray-600">
                  {restaurant.phone_number
                    .toString()
                    .replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3")}
                </p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
