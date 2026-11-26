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

export const updateUserById = async(id : string | undefined ,data : {})=>{
    const res = await updateApi(`/users/${id}`,data)
    const result = await res.json()
    return result
}

export const getUsersById = async(id:string | undefined)=>{
    const res = await getApi(`/users/${id}`)
    const data = await res.json()
    return data
}