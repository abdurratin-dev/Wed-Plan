'use server'
import { ServiceData } from "@/types/apidata";
import { creatApi, SERVER_URL } from "../server"

export const createService = async(data:ServiceData)=>{
    const res = await creatApi('/service',data);
    const result = await res.json()
    return result
}

export const getServiceData = async()=>{
    const res = await fetch(`${SERVER_URL}/service`);
    const data = await res.json();
    return data
}