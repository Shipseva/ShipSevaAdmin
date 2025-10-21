export interface Order {
  id: string;
  userId: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  orderNumber: string;
  status: OrderStatus;
  items: OrderItem[];
  shippingAddress: Address;
  billingAddress: Address;
  totalAmount: number;
  currency: string;
  paymentStatus: PaymentStatus;
  paymentMethod?: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  actualDelivery?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

export type OrderStatus = 
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "returned";

export type PaymentStatus = 
  | "pending"
  | "paid"
  | "failed"
  | "refunded"
  | "partially_refunded";

export interface OrderStats {
  total: number;
  pending: number;
  confirmed: number;
  processing: number;
  shipped: number;
  delivered: number;
  cancelled: number;
  totalRevenue: number;
  averageOrderValue: number;
}

export interface OrderAnalytics {
  ordersOverTime: Array<{
    date: string;
    count: number;
    revenue: number;
  }>;
  statusDistribution: Array<{
    status: OrderStatus;
    count: number;
    percentage: number;
  }>;
  topProducts: Array<{
    productId: string;
    productName: string;
    quantity: number;
    revenue: number;
  }>;
}
