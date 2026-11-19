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
}
