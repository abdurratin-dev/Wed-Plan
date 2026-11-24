'use server'
import { CreateServicePayload, ServiceData, UpdateServicePayload } from "@/types/apidata";
import { creatApi, deleteApi, SERVER_URL, updateApi } from "../server"

export const createService = async(data:CreateServicePayload)=>{
    const res = await creatApi('/service',data);
    const result = await res.json()
    return result
}

export const getServiceData = async(quary = ''):Promise<ServiceData[]>=>{
    const res = await fetch(`${SERVER_URL}/service?${quary}`);
    const data = await res.json();
    return data
}

export const updateService = async(data:UpdateServicePayload)=>{
    const res = await updateApi('/service',data)
    const result = await res.json()
    return result
}

export const deleteService = async(data : {})=>{
    const res = await deleteApi("/service",data)
    const result = await res.json()
    return result
}