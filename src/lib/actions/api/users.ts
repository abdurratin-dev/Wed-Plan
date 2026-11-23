'use server'
import { getApi, updateApi } from "../server"

export const getUsers = async()=>{
    const res = await getApi('/users')
    const data = await res.json()
    return data
}

export const updateUsers = async(data : {})=>{
    const res = await updateApi('/users',data)
    const result = await res.json()
    return result
}