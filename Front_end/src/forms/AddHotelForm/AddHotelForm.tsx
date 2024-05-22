import { FormProvider, useForm } from "react-hook-form";
import DetailSection from "./DetailSection";
import TypeSection from "./TypeSection";

export type HotelFormData = {
    name: string;
    city: string;
    country: string;
    description: string;
    type: string;
    pricePerNight: number;
    starRating: number;
    facilities: string[];
    imageFiles: FileList;
    imageUrls: string[];
    adultCount: number;
    childCount: number;
  };


const AddHotelForm = () => {
    const formMethod = useForm<HotelFormData>();
    return (
    <FormProvider {...formMethod}>
        <form>
            <DetailSection></DetailSection>
            <TypeSection></TypeSection>
        </form>
    </FormProvider>
    )
}


export default AddHotelForm