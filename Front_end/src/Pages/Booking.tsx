import { useQuery } from "react-query";
import * as ApiClient from "../Api/ApiClient";
import BookingForm from "../forms/BookingForm/BookingForm";

import { useParams } from "react-router-dom";
import { useSearchContext } from "../contexts/SearchContext";
import { useEffect, useState } from "react";
import BookingDetailsSummary from "../components/BookingDetailsSummary";
import { Elements } from "@stripe/react-stripe-js";
import { useAppContext } from "../contexts/AppContext";
const Booking = () => {
  const { stripePromise } = useAppContext();
  const { hotelId } = useParams();
  const search = useSearchContext();

  const [numberOfNights, setNumberOfNights] = useState<number>(0);
  useEffect(() => {
    if (search.checkIn && search.checkOut) {
      const nights =
        Math.abs(search.checkOut.getTime() - search.checkIn.getTime()) /
        (1000 * 60 * 60 * 24);

      setNumberOfNights(Math.ceil(nights));
    }
  }, [search.checkIn, search.checkOut]);

  const { isLoading:isPaymentLoading, data: paymentIntentData,error: paymentError  } = useQuery(
    "createPaymentIntent",
    () =>
      ApiClient.createPaymentIntent(
        hotelId as string,
        numberOfNights.toString()
      ),
    {
      enabled: !!hotelId && numberOfNights > 0,
    }
  );

  const { isLoading: isHotelLoading, data: hotel,error:hotelError } = useQuery(
    "fetchHotelByID",
    () => ApiClient.fetchHotelById(hotelId as string),
    {
      enabled: !!hotelId,
    }
  );
  

  
  const {isLoading: isUserLoading, data: currentUser,error: userError } = useQuery("viewInfo", ApiClient.viewInfo);
  console.log(currentUser, paymentIntentData);
  if (isHotelLoading || isPaymentLoading || isUserLoading) {
    return <div>Loading...</div>;
  }

  if (hotelError || paymentError || userError) {
    return <div>Error loading data</div>;
  }

  if (!hotel) {
    return <div>No hotel data found</div>;
  }

  return (
    <div className="grid md:grid-cols-[1fr_2fr]">
      <BookingDetailsSummary
        checkIn={search.checkIn}
        checkOut={search.checkOut}
        adultCount={search.adultCount}
        childCount={search.childCount}
        numberOfNights={numberOfNights}
        hotel={hotel}
      />
      {currentUser && paymentIntentData && (
        <Elements
          stripe={stripePromise}
          options={{ clientSecret: paymentIntentData.clientSecret }}
        >
          <BookingForm
            currentUser={currentUser}
            paymentIntent={paymentIntentData}
          />
        </Elements>
      )}
    </div>
  );
};

export default Booking;
