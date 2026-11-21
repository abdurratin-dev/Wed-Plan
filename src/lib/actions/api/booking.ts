'use server'
import { CreatBookingsPayload } from "@/types/apidata";
import { creatApi, getApi, updateApi } from "../server"

export const creatBookings = async(data:CreatBookingsPayload)=>{
    const res = await creatApi('/bookings',data)
    return res.json();
}

export const getBookings = async(quary = "")=>{
    const res = await getApi(`/bookings?${quary}`);
    return res.json();
}

export const updateBookingsAction = async(data)=>{
    const res = await updateApi('/bookings',data);
    return res.json()
}