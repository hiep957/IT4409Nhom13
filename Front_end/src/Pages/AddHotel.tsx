import { useMutation } from "react-query";
import { useAppContext } from "../contexts/AppContext";
import AddHotelForm from "../forms/AddHotelForm/AddHotelForm";
import * as ApiClient from "../Api/ApiClient"


const AddHotel = ()=> {
    const { showToast } = useAppContext();
    const {mutate, isLoading} = useMutation(ApiClient.addMyHotel, {
        onSuccess: () => {
            showToast({ message: "Hotel Saved!", type: "SUCCESS" });
            console.log("thành công");  
          },
          onError: () => {
            showToast({ message: "Error Saving Hotel", type: "ERROR" });
          },
    })
    const handleSave = (hotelFormData: FormData) => {
        mutate(hotelFormData);
    };
    return (<AddHotelForm onSave={handleSave} isLoading={isLoading}></AddHotelForm>)
    
    
}

export default AddHotel;