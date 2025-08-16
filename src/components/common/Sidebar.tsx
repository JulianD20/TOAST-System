import React from 'react';
import { 
  Home, Users, Utensils, ChefHat, CreditCard, 
  Settings, BarChart, Calendar, Monitor 
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { usePOS } from '../../contexts/POSContext';

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  roles: string[];
}

const menuItems: MenuItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <Home size={20} />, roles: ['admin', 'waiter', 'cashier'] },
  { id: 'tables', label: 'Mesas', icon: <Utensils size={20} />, roles: ['admin', 'waiter', 'host'] },
  { id: 'pos', label: 'Punto de Venta', icon: <Monitor size={20} />, roles: ['waiter'] },
  { id: 'kitchen', label: 'Cocina (KDS)', icon: <ChefHat size={20} />, roles: ['kitchen'] },
  { id: 'table-management', label: 'Gestión Mesas', icon: <Settings size={20} />, roles: ['waiter'] },
  { id: 'cashier', label: 'Caja', icon: <CreditCard size={20} />, roles: ['cashier'] },
  { id: 'products', label: 'Productos', icon: <Utensils size={20} />, roles: ['admin'] },
  { id: 'users', label: 'Usuarios', icon: <Users size={20} />, roles: ['admin'] },
  { id: 'reports', label: 'Reportes', icon: <BarChart size={20} />, roles: ['admin'] },
  { id: 'reservations', label: 'Reservas', icon: <Calendar size={20} />, roles: ['admin', 'host'] },
  { id: 'settings', label: 'Configuración', icon: <Settings size={20} />, roles: ['admin'] },
];

export function Sidebar({ currentView, onViewChange }: SidebarProps) {
  const { user } = useAuth();
  const { isDarkMode } = usePOS();

  const availableItems = menuItems.filter(item => 
    item.roles.includes(user?.role || '')
  );

  return (
    <aside className={`w-64 h-screen shadow-lg transition-colors duration-200 ${
      isDarkMode 
        ? 'bg-gray-900 border-gray-700' 
        : 'bg-white border-gray-200'
    } border-r`}>
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
            <ChefHat className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className={`text-xl font-bold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              RestaurantPOS
            </h1>
            <p className={`text-sm ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              {user?.name}
            </p>
          </div>
        </div>
      </div>

      <nav className="mt-6">
        <ul className="space-y-2 px-4">
          {availableItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onViewChange(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors duration-200 ${
                  currentView === item.id
                    ? isDarkMode
                      ? 'bg-orange-600 text-white'
                      : 'bg-orange-50 text-orange-600 border-orange-200'
                    : isDarkMode
                      ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
                      : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className={currentView === item.id ? 'text-current' : 'opacity-75'}>
                  {item.icon}
                </span>
                <span className="font-medium">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}