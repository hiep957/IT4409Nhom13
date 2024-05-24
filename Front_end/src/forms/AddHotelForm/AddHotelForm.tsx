import { FormProvider, useForm } from "react-hook-form";
import DetailSection from "./DetailSection";
import TypeSection from "./TypeSection";
import FacilitiSection from "./FacilitiSection";
import GuestSection from "./GuestSection";
import ImageSection from "./ImageSection";

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

type Props = {
  onSave: (hotelFormData:FormData) =>void,
  isLoading: boolean
}
const AddHotelForm = ({onSave, isLoading}: Props) => {
  const formMethod = useForm<HotelFormData>();
  const { handleSubmit } = formMethod;
  const onSubmit = handleSubmit((formDataJson: HotelFormData) => {
    const formData = new FormData();
    formData.append("name", formDataJson.name);
    formData.append("city", formDataJson.city);
    formData.append("country", formDataJson.country);
    formData.append("description", formDataJson.description);
    formData.append("type", formDataJson.type);
    formData.append("pricePerNight", formDataJson.pricePerNight.toString());
    formData.append("starRating", formDataJson.starRating.toString());
    formData.append("adultCount", formDataJson.adultCount.toString());
    formData.append("childCount", formDataJson.childCount.toString());

    formDataJson.facilities.forEach((facility, index) => {
      formData.append(`facilities[${index}]`, facility);
    });

    // if (formDataJson.imageUrls) {
    //   formDataJson.imageUrls.forEach((url, index) => {
    //     formData.append(`imageUrls[${index}]`, url);
    //   });
    // }

    Array.from(formDataJson.imageFiles).forEach((imageFile) => {
      formData.append(`imageFiles`, imageFile);
    });

    onSave(formData);
  });
  return (
    <FormProvider {...formMethod}>
      <form className="flex flex-col gap-10" onSubmit={onSubmit}>
        <DetailSection></DetailSection>
        <TypeSection></TypeSection>
        <FacilitiSection></FacilitiSection>
        <GuestSection></GuestSection>
        <ImageSection></ImageSection>
        <span className="flex justify-end">
          <button
            disabled={isLoading}
            type="submit"
            className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-xl disabled:bg-gray-500"
          >
            {isLoading ? "Saving..." : "Save"}
            
          </button>
        </span>
      </form>
    </FormProvider>
  );
};

export default AddHotelForm;
