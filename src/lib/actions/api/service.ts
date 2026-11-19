'use server'
import { CreateServicePayload, ServiceData } from "@/types/apidata";
import { creatApi, SERVER_URL } from "../server"

export const createService = async(data:CreateServicePayload)=>{
    const res = await creatApi('/service',data);
    const result = await res.json()
    return result
}

export const getServiceData = async():Promise<ServiceData[]>=>{
    const res = await fetch(`${SERVER_URL}/service`);
    const data = await res.json();
    return data
}