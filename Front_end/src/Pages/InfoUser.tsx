import { useState, useEffect } from 'react';
import * as ApiClient from '../Api/ApiClient';
import { useForm } from 'react-hook-form';
import { useAppContext } from '../contexts/AppContext';
import { useMutation } from 'react-query';

export type UserInfoForm = {
  _id: string;
  firstName: string;
  email: string;  
  lastName: string;
  gender: string;
  date: string;
  phone: string;
  hometown: string;
  role: string;
};

const InfoUser = () => {
  const [userInfo, setUserInfo] = useState<UserInfoForm | null>(null);
  const { register, handleSubmit, setValue } = useForm<UserInfoForm>();

  const { showToast } = useAppContext();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const info = await ApiClient.viewInfo();
        setUserInfo(info);
        setValue('firstName', info.firstName);
        setValue('lastName', info.lastName);
        setValue('gender', info.gender);
        setValue('phone', info.phone);
        setValue('date', info.date);
        setValue('hometown', info.hometown);
      } catch (error) {
        showToast({ message: 'Error fetching user info', type: 'ERROR' });
      }
    };

    fetchUserInfo();
  }, [setValue, showToast]);

  const mutation = useMutation(ApiClient.updateInfo, {
    onSuccess: () => {
      showToast({ message: 'Updated Info successfully', type: 'SUCCESS' });
    },
    onError: () => {
      showToast({ message: 'Error updating info', type: 'ERROR' });
    },
  });

  const onSubmit = (data: UserInfoForm) => {
    mutation.mutate(data);
  };

  if (!userInfo) {
    return <div>Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label>
        First Name
        <input {...register('firstName')} defaultValue={userInfo.firstName} />
      </label>
      <label>
        Last Name
        <input {...register('lastName')} defaultValue={userInfo.lastName} />
      </label>
      
      <label>
        Phone
        <input {...register('phone')} defaultValue={userInfo.phone} />
      </label>
      <label>
        Gender
        <input {...register('gender')} defaultValue={userInfo.gender} />
      </label>
      <label>
        Date
        <input {...register('date')} defaultValue={userInfo.date} />
      </label>
      <label>
        Hometown
        <input {...register('hometown')} defaultValue={userInfo.hometown} />
      </label>
      <button type="submit">Update</button>
    </form>
  );
};

export default InfoUser;
