import { useQuery } from "react-query";
import "reactjs-popup/dist/index.css";
import * as ApiClient from "../Api/ApiClient";
import { BsBuilding, BsMap } from "react-icons/bs";
import { BiHotel, BiMoney, BiStar } from "react-icons/bi";
import { Link } from "react-router-dom";
import Popup from "reactjs-popup";
import Modal from "../components/Modal";
import { useState } from "react";
import { BookingType } from "../../../BackEnd/src/shared/types";
import { useAppContext } from "../contexts/AppContext";
const MyHotels = () => {
  // const {toast} = useAppContext();
  const [showModal, setShowModal] = useState(false);
  const [bookingsLength, setBookingsLength] = useState(0);
  const [user, setUser] = useState<BookingType[]>([]); // Provide an initial value of an empty array
  const { data: hotelData } = useQuery(
    "fetchMyHotels",
    ApiClient.fetchMyHotels,
    {
      onError: () => {},
    }
  );
  if (!hotelData) {
    return <span>No Hotels found</span>;
  }
  const formatDate = (date: Date) => {
    let day = String(date.getDate()).padStart(2, "0");
    let month = String(date.getMonth() + 1).padStart(2, "0");
    let year = String(date.getFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
  };
  return (
    <div className="space-y-5">
      <span className="flex justify-between">
        <h1 className="text-3xl font-bold">My Hotels</h1>
        <Link
          to="/add-hotel"
          className="flex bg-blue-600 text-white text-xl font-bold p-2 hover:bg-blue-500"
        >
          Add Hotel
        </Link>
      </span>
      <div className="grid grid-cols-1 gap-8">
        {hotelData.map((hotel, index) => (
          <div
            data-testid="hotel-card"
            className="flex flex-col justify-between border border-slate-300 rounded-lg p-8 gap-5"
          >
            <h2 className="text-2xl font-bold">{hotel.name}</h2>
            <div className="whitespace-pre-line">{hotel.description}</div>
            <div className="grid grid-cols-5 gap-2">
              <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                <BsMap className="mr-1" />
                {hotel.city}, {hotel.country}
              </div>
              <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                <BsBuilding className="mr-1" />
                {hotel.type}
              </div>
              <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                <BiMoney className="mr-1" />£{hotel.pricePerNight} per night
              </div>
              <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                <BiHotel className="mr-1" />
                {hotel.adultCount} adults, {hotel.childCount} children
              </div>
              <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                <BiStar className="mr-1" />
                {hotel.starRating} Star Rating
              </div>
            </div>
            <span className="flex justify-end">
              <button
                className="items-center p-2 border mr-2"
                onClick={() => {
                  setShowModal(true);
                  setBookingsLength(hotel.bookings.length);
                  setUser(hotel.bookings);
                }}
              >
                Ordered {hotel.bookings.length} times
              </button>
              <Modal isVisible={showModal} onClose={() => setShowModal(false)}>
                <div className="">List of booking user</div>
                <div className="p-2 flex flex-col gap-y-5">
                  {user.map((booking, index) => (
                    <div className="flex flex-row justify-between gap-x-2 border border-slate-700 rounded p-2">
                      <div className="text-xl">
                        <div>Email: {booking.email}</div>
                        <div>TotalCost: {booking.totalCost}</div>
                      </div>
                      <div>
                        <div>Name: {booking.firstName}</div>
                        <div>
                          Time:{" "}
                          {new Date(booking.checkIn).toLocaleDateString(
                            "en-GB",
                            {
                              day: "2-digit",
                              month: "2-digit",
                              year: "2-digit",
                            }
                          )}- {
                            new Date(booking.checkOut).toLocaleDateString(
                              "en-GB",
                              {
                                day: "2-digit",
                                month: "2-digit",
                                year: "2-digit",
                              }
                            )
                          
                          }{" "}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div></div>
              </Modal>
              <Link
                to={`/edit-hotel/${hotel._id}`}
                className="flex bg-blue-600 text-white text-xl font-bold p-2 hover:bg-blue-500"
              >
                View Details
              </Link>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyHotels;
