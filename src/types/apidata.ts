interface Reviews {
  userName: string;
  Description: string;
}
export interface ServiceData {
  _id: string;
  name: string;
  category: string;
  rating: number;
  reviews: Reviews[];
  bookings: number;
  price: string;
  status: "Active" | "Inactive";
  imageUrl: string;
  alt: string;
  location: string;
  vendorName: string;
  email: string;
  description?: string;
  vendorId : string
}

/** Body sent to POST /service — a ServiceData record before the API fills it in. */
export interface CreateServicePayload {
  name: string;
  category: string;
  description: string;
  price: string;
  location: string;
  imageUrl: string;
  status: "Active";
  vendorId : string | undefined
  vendorName: string | undefined
  email: string | undefined
}

export interface BookingsData {
  _id: string
  bookingTitle: string
  bookingsId: string
  bookingsCategory: string
  bookingsLocation: string
  bookingsPrice: string
  bookingsRating: number
  bookingsImage: string
  bookingStatus: "Upcoming" | "Confirmed" | "Completed" | "Cancelled";
  bookingsDate: string
  bookingsTime: string
  bookingsUnit: string
  bookingsDuration: string
  customerName: string | undefined
  customerEmail: string | undefined
  customerId: string | undefined
  customerImg: string | undefined | null
  status? : number
}

export interface CreatBookingsPayload {
  bookingTitle: string
  bookingsId: string
  bookingsCategory: string
  bookingsLocation: string
  bookingsPrice: string
  bookingsRating: number
  bookingsImage: string
  bookingStatus: "Upcoming" | "Confirmed" | "Completed" | "Cancelled";
  bookingsDate: string
  bookingsTime: string
  bookingsUnit: string
  bookingsDuration: string
  customerName: string | undefined
  customerEmail: string | undefined
  customerId: string | undefined
  customerImg: string | undefined | null
}
