import { useAppContext } from "../contexts/AppContext";
import AddHotelForm from "../forms/AddHotelForm/AddHotelForm";



const AddHotel = ()=> {
    const { showToast } = useAppContext();
    return <AddHotelForm></AddHotelForm>
    
}

export default AddHotel;