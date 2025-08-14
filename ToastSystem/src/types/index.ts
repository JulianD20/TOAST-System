// Types and interfaces for the POS system
export interface User {
  id: string;
  name: string;
  username: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
}

export type UserRole = 'admin' | 'waiter' | 'cashier' | 'kitchen' | 'host';

export interface Table {
  id: string;
  number: number;
  capacity: number;
  zone: string;
  status: TableStatus;
  x: number;
  y: number;
  width: number;
  height: number;
  currentOrder?: string;
}

export type TableStatus = 'available' | 'occupied' | 'reserved' | 'dirty' | 'pending';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  modifiers: Modifier[];
  isActive: boolean;
}

export interface Modifier {
  id: string;
  name: string;
  price: number;
  type: 'addition' | 'substitution';
}

export interface OrderItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  modifiers: Modifier[];
  notes: string;
  status: OrderItemStatus;
}

export type OrderItemStatus = 'pending' | 'preparing' | 'ready' | 'served';

export interface Order {
  id: string;
  tableId: string;
  waiterId: string;
  items: OrderItem[];
  status: OrderStatus;
  total: number;
  createdAt: Date;
  updatedAt: Date;
}

export type OrderStatus = 'open' | 'sent' | 'preparing' | 'ready' | 'completed' | 'cancelled';

export interface PaymentMethod {
  id: string;
  type: 'cash' | 'card' | 'transfer';
  amount: number;
}

export interface Sale {
  id: string;
  orderId: string;
  total: number;
  paymentMethods: PaymentMethod[];
  createdAt: Date;
}

export interface DashboardStats {
  totalSales: number;
  tablesServed: number;
  openOrders: number;
  completedOrders: number;
  averageTicket: number;
}
export interface Reservation {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  tableId: string;
  date: Date;
  time: string;
  partySize: number;
  status: 'confirmed' | 'seated' | 'completed' | 'cancelled' | 'no-show';
  notes?: string;
  createdAt: Date;
}