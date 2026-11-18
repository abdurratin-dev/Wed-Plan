'use server'
import { creatApi } from "../server"

export const createService = async(data)=>{
    const res = await creatApi('/service',data);
    const result = await res.json()
    console.log(result);
}