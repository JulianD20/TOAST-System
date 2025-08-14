import React, { createContext, useContext, useState, useEffect } from 'react';
import { Table, Product, Order, OrderItem, DashboardStats } from '../types';

interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  timestamp: Date;
}

interface POSContextType {
  tables: Table[];
  products: Product[];
  orders: Order[];
  currentOrder: Order | null;
  dashboardStats: DashboardStats;
  notifications: Notification[];
  currency: string;
  setCurrency: (currency: string) => void;
  
  // Table management
  updateTable: (table: Table) => void;
  addTable: (table: Omit<Table, 'id'>) => void;
  resetTableStatus: (tableId: string) => void;
  
  // Order management
  createOrder: (tableId: string, waiterId: string) => void;
  addItemToOrder: (item: Omit<OrderItem, 'id'>) => void;
  updateOrderItem: (itemId: string, updates: Partial<OrderItem>) => void;
  removeItemFromOrder: (itemId: string) => void;
  sendOrderToKitchen: () => void;
  completeOrder: (orderId: string) => void;
  payOrder: (orderId: string) => void;
  
  // Product management
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (product: Product) => void;
  
  // Current order
  setCurrentOrder: (order: Order | null) => void;
  
  // Notifications
  addNotification: (message: string, type: Notification['type']) => void;
  removeNotification: (id: string) => void;
  
  // Theme
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const POSContext = createContext<POSContextType | undefined>(undefined);

// Mock data
const mockTables: Table[] = [
  { id: '1', number: 1, capacity: 4, zone: 'Salón', status: 'available', x: 50, y: 50, width: 80, height: 80 },
  { id: '2', number: 2, capacity: 2, zone: 'Salón', status: 'occupied', x: 150, y: 50, width: 60, height: 60 },
  { id: '3', number: 3, capacity: 6, zone: 'Terraza', status: 'available', x: 250, y: 50, width: 100, height: 80 },
  { id: '4', number: 4, capacity: 4, zone: 'Barra', status: 'reserved', x: 50, y: 150, width: 80, height: 80 },
];

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Hamburguesa Clásica',
    description: 'Carne, lechuga, tomate, cebolla',
    price: 12.99,
    category: 'Platos principales',
    image: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=400',
    modifiers: [
      { id: '1', name: 'Extra queso', price: 1.50, type: 'addition' },
      { id: '2', name: 'Sin cebolla', price: 0, type: 'substitution' },
    ],
    isActive: true,
  },
  {
    id: '2',
    name: 'Pizza Margherita',
    description: 'Salsa de tomate, mozzarella, albahaca',
    price: 15.99,
    category: 'Platos principales',
    image: 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=400',
    modifiers: [
      { id: '3', name: 'Extra pepperoni', price: 2.00, type: 'addition' },
    ],
    isActive: true,
  },
  {
    id: '3',
    name: 'Café Americano',
    description: 'Café negro tradicional',
    price: 3.50,
    category: 'Bebidas',
    image: 'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=400',
    modifiers: [],
    isActive: true,
  },
  {
    id: '4',
    name: 'Ensalada César',
    description: 'Lechuga, pollo, crutones, parmesano',
    price: 9.99,
    category: 'Ensaladas',
    image: 'https://images.pexels.com/photos/1059905/pexels-photo-1059905.jpeg?auto=compress&cs=tinysrgb&w=400',
    modifiers: [
      { id: '4', name: 'Extra pollo', price: 3.00, type: 'addition' },
    ],
    isActive: true,
  },
  {
    id: '5',
    name: 'Tacos de Carnitas',
    description: 'Tortillas de maíz, carnitas, cebolla, cilantro',
    price: 8.99,
    category: 'Platos principales',
    image: 'https://images.pexels.com/photos/4958792/pexels-photo-4958792.jpeg?auto=compress&cs=tinysrgb&w=400',
    modifiers: [
      { id: '5', name: 'Extra salsa', price: 0.50, type: 'addition' },
      { id: '6', name: 'Sin cebolla', price: 0, type: 'substitution' },
    ],
    isActive: true,
  },
  {
    id: '6',
    name: 'Salmón a la Parrilla',
    description: 'Salmón fresco con vegetales asados',
    price: 22.99,
    category: 'Platos principales',
    image: 'https://images.pexels.com/photos/1516415/pexels-photo-1516415.jpeg?auto=compress&cs=tinysrgb&w=400',
    modifiers: [
      { id: '7', name: 'Salsa de limón', price: 1.00, type: 'addition' },
    ],
    isActive: true,
  },
  {
    id: '7',
    name: 'Pasta Carbonara',
    description: 'Pasta con huevo, panceta y parmesano',
    price: 14.99,
    category: 'Platos principales',
    image: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=400',
    modifiers: [
      { id: '8', name: 'Extra panceta', price: 2.50, type: 'addition' },
    ],
    isActive: true,
  },
  {
    id: '8',
    name: 'Smoothie de Frutas',
    description: 'Mezcla de frutas tropicales',
    price: 5.99,
    category: 'Bebidas',
    image: 'https://images.pexels.com/photos/775032/pexels-photo-775032.jpeg?auto=compress&cs=tinysrgb&w=400',
    modifiers: [
      { id: '9', name: 'Extra proteína', price: 1.50, type: 'addition' },
    ],
    isActive: true,
  },
  {
    id: '9',
    name: 'Cheesecake',
    description: 'Tarta de queso con frutos rojos',
    price: 6.99,
    category: 'Postres',
    image: 'https://images.pexels.com/photos/140831/pexels-photo-140831.jpeg?auto=compress&cs=tinysrgb&w=400',
    modifiers: [],
    isActive: true,
  },
  {
    id: '10',
    name: 'Cerveza Artesanal',
    description: 'Cerveza local de barril',
    price: 4.50,
    category: 'Bebidas',
    image: 'https://images.pexels.com/photos/1552630/pexels-photo-1552630.jpeg?auto=compress&cs=tinysrgb&w=400',
    modifiers: [],
    isActive: true,
  },
];

export function POSProvider({ children }: { children: React.ReactNode }) {
  const [tables, setTables] = useState<Table[]>(mockTables);
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [currency, setCurrency] = useState('USD');

  const addNotification = (message: string, type: Notification['type']) => {
    const notification: Notification = {
      id: Date.now().toString(),
      message,
      type,
      timestamp: new Date(),
    };
    setNotifications(prev => [...prev, notification]);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
  };

  const updateTable = (updatedTable: Table) => {
    setTables(prev => prev.map(table => 
      table.id === updatedTable.id ? updatedTable : table
    ));
  };

  const addTable = (tableData: Omit<Table, 'id'>) => {
    const newTable: Table = {
      ...tableData,
      id: Date.now().toString(),
    };
    setTables(prev => [...prev, newTable]);
    addNotification(`Mesa ${newTable.number} agregada exitosamente`, 'success');
  };

  const resetTableStatus = (tableId: string) => {
    const table = tables.find(t => t.id === tableId);
    if (table) {
      updateTable({
        ...table,
        status: 'available',
        currentOrder: undefined,
      });
      addNotification(`Mesa ${table.number} marcada como disponible`, 'info');
    }
  };

  const createOrder = (tableId: string, waiterId: string) => {
    const newOrder: Order = {
      id: Date.now().toString(),
      tableId,
      waiterId,
      items: [],
      status: 'open',
      total: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    setOrders(prev => [...prev, newOrder]);
    setCurrentOrder(newOrder);
    addNotification(`Pedido iniciado en Mesa ${tables.find(t => t.id === tableId)?.number}`, 'info');
    
    // Update table status
    updateTable({
      ...tables.find(t => t.id === tableId)!,
      status: 'occupied',
      currentOrder: newOrder.id,
    });
  };

  const addItemToOrder = (itemData: Omit<OrderItem, 'id'>) => {
    if (!currentOrder) return;

    const newItem: OrderItem = {
      ...itemData,
      id: Date.now().toString(),
      status: 'pending',
    };

    const updatedOrder = {
      ...currentOrder,
      items: [...currentOrder.items, newItem],
      total: currentOrder.total + (itemData.product.price * itemData.quantity),
      updatedAt: new Date(),
    };

    setCurrentOrder(updatedOrder);
    setOrders(prev => prev.map(order =>
      order.id === currentOrder.id ? updatedOrder : order
    ));
  };

  const updateOrderItem = (itemId: string, updates: Partial<OrderItem>) => {
    if (!currentOrder) return;

    const updatedItems = currentOrder.items.map(item =>
      item.id === itemId ? { ...item, ...updates } : item
    );

    const total = updatedItems.reduce((sum, item) => 
      sum + (item.product.price * item.quantity), 0
    );

    const updatedOrder = {
      ...currentOrder,
      items: updatedItems,
      total,
      updatedAt: new Date(),
    };

    setCurrentOrder(updatedOrder);
    setOrders(prev => prev.map(order =>
      order.id === currentOrder.id ? updatedOrder : order
    ));
  };

  const removeItemFromOrder = (itemId: string) => {
    if (!currentOrder) return;

    const updatedItems = currentOrder.items.filter(item => item.id !== itemId);
    const total = updatedItems.reduce((sum, item) => 
      sum + (item.product.price * item.quantity), 0
    );

    const updatedOrder = {
      ...currentOrder,
      items: updatedItems,
      total,
      updatedAt: new Date(),
    };

    setCurrentOrder(updatedOrder);
    setOrders(prev => prev.map(order =>
      order.id === currentOrder.id ? updatedOrder : order
    ));
  };

  const sendOrderToKitchen = () => {
    if (!currentOrder) return;

    const updatedOrder = {
      ...currentOrder,
      status: 'sent' as const,
      updatedAt: new Date(),
    };

    setCurrentOrder(null);
    setOrders(prev => prev.map(order =>
      order.id === currentOrder.id ? updatedOrder : order
    ));
    
    addNotification(`Pedido enviado a cocina - Mesa ${tables.find(t => t.id === currentOrder.tableId)?.number}`, 'success');
  };

  const completeOrder = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    
    const table = tables.find(t => t.id === order.tableId);
    
    setOrders(prev => prev.map(order =>
      order.id === orderId 
        ? { ...order, status: 'ready' as const, updatedAt: new Date() }
        : order
    ));
    
    addNotification(`Pedido listo para cobrar - Mesa ${table?.number}`, 'info');
  };

  const payOrder = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    
    const table = tables.find(t => t.id === order.tableId);
    
    // Mark order as completed
    setOrders(prev => prev.map(o =>
      o.id === orderId 
        ? { ...o, status: 'completed' as const, updatedAt: new Date() }
        : o
    ));
    
    // Reset table to available
    if (table) {
      updateTable({
        ...table,
        status: 'available',
        currentOrder: undefined,
      });
    }
    
    addNotification(`Pago completado - Mesa ${table?.number} ahora disponible`, 'success');
  };

  const addProduct = (productData: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...productData,
      id: Date.now().toString(),
    };
    setProducts(prev => [...prev, newProduct]);
    addNotification(`Producto "${newProduct.name}" agregado exitosamente`, 'success');
  };

  const updateProduct = (updatedProduct: Product) => {
    setProducts(prev => prev.map(product =>
      product.id === updatedProduct.id ? updatedProduct : product
    ));
    addNotification(`Producto "${updatedProduct.name}" actualizado`, 'info');
  };

  // Calculate dashboard stats
  const dashboardStats: DashboardStats = {
    totalSales: orders
      .filter(o => o.status === 'completed')
      .reduce((sum, order) => sum + order.total, 0),
    tablesServed: orders.filter(o => o.status === 'completed').length,
    openOrders: orders.filter(o => ['open', 'sent', 'preparing'].includes(o.status)).length,
    completedOrders: orders.filter(o => o.status === 'completed').length,
    averageTicket: orders.length > 0 
      ? orders.reduce((sum, order) => sum + order.total, 0) / orders.length 
      : 0,
  };

  return (
    <POSContext.Provider
      value={{
        tables,
        products,
        orders,
        currentOrder,
        dashboardStats,
        notifications,
        currency,
        setCurrency,
        updateTable,
        addTable,
        resetTableStatus,
        createOrder,
        addItemToOrder,
        updateOrderItem,
        removeItemFromOrder,
        sendOrderToKitchen,
        completeOrder,
        payOrder,
        addProduct,
        updateProduct,
        setCurrentOrder,
        addNotification,
        removeNotification,
        isDarkMode,
        toggleTheme,
      }}
    >
      {children}
    </POSContext.Provider>
  );
}

export function usePOS() {
  const context = useContext(POSContext);
  if (context === undefined) {
    throw new Error('usePOS must be used within a POSProvider');
  }
  return context;
}