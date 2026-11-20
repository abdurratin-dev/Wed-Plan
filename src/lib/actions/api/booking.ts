'use server'
import { CreatBookingsPayload } from "@/types/apidata";
import { creatApi } from "../server"

export const creatBookings = async(data:CreatBookingsPayload)=>{
    const res = await creatApi('/bookings',data)
    return res.json();
}

export const getBookings = async()=>{
    const res = ''
}