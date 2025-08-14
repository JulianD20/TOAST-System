import React from 'react';
import { Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { usePOS } from '../../contexts/POSContext';

export function KitchenView() {
  const { orders, tables, completeOrder, isDarkMode, addNotification } = usePOS();

  const activeOrders = orders.filter(order => 
    ['sent', 'preparing'].includes(order.status)
  );

  const getOrderTime = (createdAt: Date) => {
    const now = new Date();
    const diff = now.getTime() - createdAt.getTime();
    const minutes = Math.floor(diff / 60000);
    return minutes;
  };

  const getTimeColor = (minutes: number) => {
    if (minutes < 10) return 'text-green-600';
    if (minutes < 20) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleCompleteOrder = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    const table = tables.find(t => t.id === order?.tableId);
    completeOrder(orderId);
    addNotification(`Pedido completado - Mesa ${table?.number} listo para cobrar`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-bold ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Sistema de Cocina (KDS)
          </h1>
          <p className={`mt-2 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Pedidos activos para preparar
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className={`px-4 py-2 rounded-lg ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          } shadow`}>
            <span className={`text-2xl font-bold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {activeOrders.length}
            </span>
            <span className={`block text-sm ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Pedidos activos
            </span>
          </div>
        </div>
      </div>

      {/* Orders Grid */}
      {activeOrders.length === 0 ? (
        <div className={`text-center py-12 ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        } rounded-2xl shadow-lg`}>
          <CheckCircle className={`w-16 h-16 mx-auto mb-4 ${
            isDarkMode ? 'text-gray-600' : 'text-gray-400'
          }`} />
          <h3 className={`text-xl font-semibold mb-2 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            No hay pedidos pendientes
          </h3>
          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
            Todos los pedidos han sido completados
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeOrders.map((order) => {
            const table = tables.find(t => t.id === order.tableId);
            const minutes = getOrderTime(order.createdAt);
            const timeColor = getTimeColor(minutes);

            return (
              <div
                key={order.id}
                className={`p-6 rounded-2xl shadow-lg border-2 transition-all duration-200 ${
                  isDarkMode 
                    ? 'bg-gray-800 border-gray-700' 
                    : 'bg-white border-gray-200'
                } ${
                  minutes > 20 ? 'border-red-500' : 
                  minutes > 10 ? 'border-yellow-500' : 'border-green-500'
                }`}
              >
                {/* Order Header */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className={`text-xl font-bold ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      Mesa {table?.number}
                    </h3>
                    <p className={`text-sm ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Pedido #{order.id.slice(-4)}
                    </p>
                  </div>
                  
                  <div className={`flex items-center space-x-2 ${timeColor}`}>
                    <Clock size={16} />
                    <span className="font-medium">{minutes}min</span>
                    {minutes > 20 && <AlertCircle size={16} />}
                  </div>
                </div>

                {/* Order Items */}
                <div className="space-y-3 mb-6">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className={`p-3 rounded-lg ${
                        isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className={`font-medium ${
                            isDarkMode ? 'text-white' : 'text-gray-900'
                          }`}>
                            {item.product.name}
                          </p>
                          {item.notes && (
                            <p className={`text-sm mt-1 ${
                              isDarkMode ? 'text-gray-400' : 'text-gray-600'
                            }`}>
                              Nota: {item.notes}
                            </p>
                          )}
                          {item.modifiers.length > 0 && (
                            <p className={`text-sm mt-1 ${
                              isDarkMode ? 'text-gray-400' : 'text-gray-600'
                            }`}>
                              {item.modifiers.map(m => m.name).join(', ')}
                            </p>
                          )}
                        </div>
                        <div className={`text-xl font-bold ${
                          isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          x{item.quantity}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Complete Button */}
                <button
                  onClick={() => handleCompleteOrder(order.id)}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors"
                >
                  <CheckCircle size={20} />
                  <span>Marcar como Listo</span>
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}