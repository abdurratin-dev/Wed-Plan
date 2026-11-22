'use server'
import { CreatChackoutPayload } from "@/types/apidata";
import { creatApi, getApi } from "../server"

export const creatChakout = async(api: CreatChackoutPayload)=>{
    const res = await creatApi('/subscription/create-checkout-session', api)
    return res.json();
}

export const getSubscriptionService = async(query = "")=>{
    const res = await getApi('/subscription/service');
    return res.json()
}