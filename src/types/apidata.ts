export interface ServiceData {
  _id:string;
  name: string;
  category: string;
  rating: number;
  reviews: number;
  bookings: number;
  price: string;
  unit: string;
  status: "Active" | "Inactive";
  imageUrl: string;
  alt: string;
  location : string
}

/** Body sent to POST /service — a ServiceData record before the API fills it in. */
export interface CreateServicePayload {
  name: string;
  category: string;
  description: string;
  price: string;
  location: string;
  imageUrl: string;
}
