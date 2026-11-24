import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
const client = new MongoClient(process.env.MONGODB_URI as string);
const db = client.db('WedPlan');
export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  user: {
    additionalFields: {
      role: {
        type: ["customer", "vendor", "admin"],
        input: true,
        defaultValue: "customer",
      },
      // Set by the payment flow (direct Mongo update); declared here so
      // `listUsers` includes it in the admin Users page output.
      premium: {
        type: "boolean",
        input: false,
        defaultValue: false,
      },
      status : {
        type : ["Active" , "Blocked"],
        input : false,
        defaultValue : "Active"
      }
    },
  },
  database: mongodbAdapter(db, {
    client,
  }),
});