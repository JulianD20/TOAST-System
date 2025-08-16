import React, { useState } from 'react';
import { BarChart3, TrendingUp, DollarSign, Users, Calendar, Download } from 'lucide-react';
import { usePOS } from '../../contexts/POSContext';

export function ReportsView() {
  const { orders, tables, products, dashboardStats, isDarkMode } = usePOS();
  const [selectedPeriod, setSelectedPeriod] = useState('today');

  const getFilteredOrders = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    return orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      switch (selectedPeriod) {
        case 'today':
          return orderDate >= today;
        case 'week':
          return orderDate >= thisWeek;
        case 'month':
          return orderDate >= thisMonth;
        default:
          return true;
      }
    });
  };

  const filteredOrders = getFilteredOrders();
  const completedOrders = filteredOrders.filter(o => o.status === 'completed');
  
  const totalRevenue = completedOrders.reduce((sum, order) => sum + order.total, 0);
  const averageOrderValue = completedOrders.length > 0 ? totalRevenue / completedOrders.length : 0;
  
  // Top selling products
  const productSales = new Map();
  completedOrders.forEach(order => {
    order.items.forEach(item => {
      const current = productSales.get(item.product.id) || { product: item.product, quantity: 0, revenue: 0 };
      current.quantity += item.quantity;
      current.revenue += item.product.price * item.quantity;
      productSales.set(item.product.id, current);
    });
  });
  
  const topProducts = Array.from(productSales.values())
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);

  // Sales by hour
  const hourlyData = new Array(24).fill(0);
  completedOrders.forEach(order => {
    const hour = new Date(order.createdAt).getHours();
    hourlyData[hour] += order.total;
  });

  const maxHourlyValue = Math.max(...hourlyData);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-bold ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Reportes y Analytics
          </h1>
          <p className={`mt-2 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Análisis detallado del rendimiento del restaurante
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className={`px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isDarkMode 
                ? 'bg-gray-800 border-gray-700 text-white' 
                : 'bg-white border-gray-200 text-gray-900'
            }`}
          >
            <option value="today">Hoy</option>
            <option value="week">Esta Semana</option>
            <option value="month">Este Mes</option>
            <option value="all">Todo el Tiempo</option>
          </select>
          
          <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
            <Download size={20} />
            <span>Exportar</span>
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className={`p-6 rounded-2xl shadow-lg ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Ingresos Totales
              </p>
              <p className={`text-2xl font-bold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                ${totalRevenue.toFixed(2)}
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className={`p-6 rounded-2xl shadow-lg ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Pedidos Completados
              </p>
              <p className={`text-2xl font-bold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {completedOrders.length}
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <BarChart3 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className={`p-6 rounded-2xl shadow-lg ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Ticket Promedio
              </p>
              <p className={`text-2xl font-bold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                ${averageOrderValue.toFixed(2)}
              </p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        <div className={`p-6 rounded-2xl shadow-lg ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Mesas Activas
              </p>
              <p className={`text-2xl font-bold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {tables.filter(t => t.status === 'occupied').length}
              </p>
            </div>
            <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
              <Users className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hourly Sales Chart */}
        <div className={`p-6 rounded-2xl shadow-lg ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <h3 className={`text-lg font-semibold mb-4 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Ventas por Hora
          </h3>
          <div className="space-y-2">
            {hourlyData.map((value, hour) => (
              <div key={hour} className="flex items-center space-x-3">
                <div className={`w-12 text-sm ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {hour.toString().padStart(2, '0')}:00
                </div>
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-4 relative">
                  <div
                    className="bg-blue-600 h-4 rounded-full transition-all duration-300"
                    style={{ width: `${maxHourlyValue > 0 ? (value / maxHourlyValue) * 100 : 0}%` }}
                  ></div>
                </div>
                <div className={`w-16 text-sm text-right ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  ${value.toFixed(0)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className={`p-6 rounded-2xl shadow-lg ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <h3 className={`text-lg font-semibold mb-4 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Productos Más Vendidos
          </h3>
          <div className="space-y-4">
            {topProducts.map((item, index) => (
              <div key={item.product.id} className="flex items-center space-x-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  index === 0 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100' :
                  index === 1 ? 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100' :
                  index === 2 ? 'bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-100' :
                  'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100'
                }`}>
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className={`font-medium ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {item.product.name}
                  </p>
                  <p className={`text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {item.quantity} vendidos
                  </p>
                </div>
                <div className={`text-right ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  <p className="font-semibold">${item.revenue.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Table Performance */}
      <div className={`p-6 rounded-2xl shadow-lg ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <h3 className={`text-lg font-semibold mb-4 ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>
          Rendimiento por Mesa
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b ${
                isDarkMode ? 'border-gray-700' : 'border-gray-200'
              }`}>
                <th className={`text-left py-3 px-4 font-medium ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Mesa
                </th>
                <th className={`text-left py-3 px-4 font-medium ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Zona
                </th>
                <th className={`text-left py-3 px-4 font-medium ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Estado
                </th>
                <th className={`text-left py-3 px-4 font-medium ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Pedidos Hoy
                </th>
                <th className={`text-left py-3 px-4 font-medium ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Ingresos
                </th>
              </tr>
            </thead>
            <tbody>
              {tables.map((table) => {
                const tableOrders = filteredOrders.filter(o => o.tableId === table.id && o.status === 'completed');
                const tableRevenue = tableOrders.reduce((sum, order) => sum + order.total, 0);
                
                return (
                  <tr key={table.id} className={`border-b ${
                    isDarkMode ? 'border-gray-700' : 'border-gray-200'
                  }`}>
                    <td className={`py-3 px-4 ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      Mesa {table.number}
                    </td>
                    <td className={`py-3 px-4 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {table.zone}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        table.status === 'available' ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' :
                        table.status === 'occupied' ? 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100' :
                        table.status === 'reserved' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100' :
                        'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100'
                      }`}>
                        {table.status === 'available' ? 'Disponible' :
                         table.status === 'occupied' ? 'Ocupada' :
                         table.status === 'reserved' ? 'Reservada' : 'Sucia'}
                      </span>
                    </td>
                    <td className={`py-3 px-4 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {tableOrders.length}
                    </td>
                    <td className={`py-3 px-4 font-semibold ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      ${tableRevenue.toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}