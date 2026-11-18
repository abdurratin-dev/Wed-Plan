import { headers } from "next/headers";
import { auth } from "../auth";

export const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
const user = async () => {
  const session = await auth.api.getSession({
    headers: await headers(), // you need to pass the headers object.
  });
  return session?.session.token;
};

export const creatApi = async (api: string, data) => {
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
