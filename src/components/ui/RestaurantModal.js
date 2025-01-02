import React from "react";

const RestaurantModal = ({ restaurant, onClose }) => {
  return (
    <div className="modal">
      <h2 className="text-lg font-bold">{restaurant.name}</h2>
      <img
        src={restaurant.thumbnail}
        alt={restaurant.name}
        className="w-full h-48 object-cover rounded"
      />
      <p>{restaurant.address.fullAddress}</p>
      <p>Rating: {restaurant.rating}</p>
      <p>Cuisines: {restaurant.cuisines.join(", ")}</p>
      <button
        onClick={onClose}
        className="bg-red-500 text-white rounded px-4 py-2"
      >
        Close
      </button>
    </div>
  );
};

export default RestaurantModal;
