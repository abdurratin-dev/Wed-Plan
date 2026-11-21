import { headers } from "next/headers";
import { auth } from "../auth";
import { CreatBookingsPayload, CreateServicePayload } from "@/types/apidata";

export const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
const user = async () => {
  const session = await auth.api.getSession({
    headers: await headers(), // you need to pass the headers object.
  });
  return session?.session.token;
};

export const creatApi = async (api: string, data: CreateServicePayload | CreatBookingsPayload) => {
  const token = await user();
  const res = await fetch(`${SERVER_URL}${api}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: `Brrer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return res;
};

export const getApi = async(api:string)=>{
  const token = await user();
  const res = await fetch(`${SERVER_URL}${api}`,{
    headers :{
      authorization: `Brrer ${token}`,
    }
  })
  return res
}

export const updateApi = async(api:string,data)=>{
  const token = await user()
  const res = await fetch(`${SERVER_URL}${api}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      authorization: `Brrer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return res
}
