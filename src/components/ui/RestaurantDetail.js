import React from "react";

const RestaurantDetail = ({ restaurant }) => {
  return (
    <div className="restaurant-detail">
      <h2>{restaurant.name}</h2>
      <img
        src={restaurant.icon || "path/to/fallback-image.jpg"}
        alt={restaurant.name}
      />
      <p>Address: {restaurant.formatted_address}</p>
      <p>Price: {formatPrice(restaurant.price_level)}</p>
      <p>
        Rating: {restaurant.rating || "N/A"} {renderStars(restaurant.rating)}
      </p>
      <p>Status: {restaurant.business_status}</p>
      {/* Add menu details here */}
    </div>
  );
};

const formatPrice = (priceLevel) => {
  if (!priceLevel) return "N/A";
  return "$".repeat(priceLevel);
};

const renderStars = (rating) => {
  if (!rating) return null;
  const stars = Math.round(rating);
  return (
    <span>
      {"★".repeat(stars)}
      {"☆".repeat(5 - stars)}
    </span>
  );
};

export default RestaurantDetail;
