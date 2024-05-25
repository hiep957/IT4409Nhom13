import { useParams } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import { useMutation, useQuery } from "react-query";

import * as ApiClient from "../Api/ApiClient"
import AddHotelForm from "../forms/AddHotelForm/AddHotelForm";




const EditHotel = () => {
    const { hotelId } = useParams();
    const { showToast } = useAppContext();
  
    const { data: hotel } = useQuery(
      "fetchMyHotelById",
      () => ApiClient.fetchMyHotelById(hotelId || ""),
      {
        enabled: !!hotelId,
      }
    );
    console.log(hotel);
  
    const { mutate, isLoading } = useMutation(ApiClient.updateMyHotelById, {
      onSuccess: () => {
        showToast({ message: "Hotel Saved!", type: "SUCCESS" });
      },
      onError: () => {
        showToast({ message: "Error Saving Hotel", type: "ERROR" });
      },
    });
  
    const handleSave = (hotelFormData: FormData) => {
      mutate(hotelFormData);
    };
  
    return (
      <AddHotelForm hotel={hotel} onSave={handleSave} isLoading={isLoading} />
    );
  };
  
  export default EditHotel;