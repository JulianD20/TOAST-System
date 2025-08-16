import React, { useState } from 'react';
import { CreditCard, DollarSign, Smartphone, Receipt, Calculator, Printer } from 'lucide-react';
import { usePOS } from '../../contexts/POSContext';
import { Order, PaymentMethod } from '../../types';
import { formatCurrency } from '../../utils/currency';

export function CashierView() {
  const { orders, tables, payOrder, isDarkMode, addNotification, currency } = usePOS();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [cashReceived, setCashReceived] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);
  const [paidOrder, setPaidOrder] = useState<Order | null>(null);

  const completedOrders = orders.filter(order => 
    order.status === 'ready'
  );

  const handleSelectOrder = (order: Order) => {
    setSelectedOrder(order);
    setPaymentMethods([]);
    setCashReceived('');
    setShowPaymentModal(true);
  };

  const addPaymentMethod = (type: 'cash' | 'card' | 'transfer', amount: number) => {
    const newPayment: PaymentMethod = {
      id: Date.now().toString(),
      type,
      amount,
    };
    setPaymentMethods(prev => [...prev, newPayment]);
  };

  const getTotalPaid = () => {
    return paymentMethods.reduce((sum, payment) => sum + payment.amount, 0);
  };

  const getChange = () => {
    const cashPayment = paymentMethods.find(p => p.type === 'cash');
    if (cashPayment && cashReceived) {
      return parseFloat(cashReceived) - cashPayment.amount;
    }
    return 0;
  };

  const handleCompletePayment = () => {
    if (selectedOrder && getTotalPaid() >= selectedOrder.total) {
      payOrder(selectedOrder.id);
      addNotification(`Pago completado - Mesa ${tables.find(t => t.id === selectedOrder.tableId)?.number}`, 'success');
      setPaidOrder(selectedOrder);
      setShowPaymentModal(false);
      setSelectedOrder(null);
      setPaymentMethods([]);
      setCashReceived('');
      setShowInvoice(true);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className={`text-3xl font-bold ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>
          Sistema de Caja
        </h1>
        <p className={`mt-2 ${
          isDarkMode ? 'text-gray-400' : 'text-gray-600'
        }`}>
          Procesar pagos y cerrar cuentas
        </p>
      </div>

      {/* Orders to Pay */}
      <div className={`p-6 rounded-2xl shadow-lg ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <h2 className={`text-xl font-semibold mb-4 ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>
          Cuentas Pendientes de Pago
        </h2>

        {completedOrders.length === 0 ? (
          <div className="text-center py-8">
            <Receipt className={`w-16 h-16 mx-auto mb-4 ${
              isDarkMode ? 'text-gray-600' : 'text-gray-400'
            }`} />
            <h3 className={`text-lg font-semibold mb-2 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              No hay cuentas pendientes
            </h3>
            <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
              Todas las cuentas han sido pagadas
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {completedOrders.map((order) => {
              const table = tables.find(t => t.id === order.tableId);
              return (
                <div
                  key={order.id}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 hover:border-blue-500' 
                      : 'bg-gray-50 border-gray-200 hover:border-blue-500'
                  }`}
                  onClick={() => handleSelectOrder(order)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className={`text-lg font-bold ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      Mesa {table?.number}
                    </h3>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      order.status === 'ready' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
                    }`}>
                      {order.status === 'ready' ? 'Listo' : 'Preparando'}
                    </span>
                  </div>
                  
                  <div className="space-y-2 mb-3">
                    {order.items.slice(0, 3).map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          {item.quantity}x {item.product.name}
                        </span>
                        <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          {formatCurrency(item.product.price * item.quantity, currency)}
                        </span>
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        +{order.items.length - 3} productos más...
                      </div>
                    )}
                  </div>
                  
                  <div className="border-t pt-3 border-gray-300 dark:border-gray-600">
                    <div className="flex justify-between items-center">
                      <span className={`font-semibold ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        Total:
                      </span>
                      <span className="text-xl font-bold text-green-600">
                        ${order.total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`p-6 rounded-2xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-2xl font-bold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Procesar Pago - Mesa {tables.find(t => t.id === selectedOrder.tableId)?.number}
              </h3>
              <button
                onClick={() => setShowPaymentModal(false)}
                className={`text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200`}
              >
                ✕
              </button>
            </div>

            {/* Order Summary */}
            <div className={`p-4 rounded-lg mb-6 ${
              isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
            }`}>
              <h4 className={`font-semibold mb-3 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Resumen del Pedido
              </h4>
              <div className="space-y-2">
                {selectedOrder.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {item.quantity}x {item.product.name}
                    </span>
                    <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-2 mt-3 border-gray-300 dark:border-gray-600">
                <div className="flex justify-between font-bold">
                  <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>Total:</span>
                  <span className="text-green-600">${selectedOrder.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <button
                onClick={() => {
                  const amount = selectedOrder.total - getTotalPaid();
                  if (amount > 0) {
                    addPaymentMethod('cash', amount);
                  }
                }}
                className="flex flex-col items-center p-4 rounded-lg border-2 border-dashed border-green-300 hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900 transition-colors"
              >
                <DollarSign className="w-8 h-8 text-green-600 mb-2" />
                <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Efectivo
                </span>
              </button>

              <button
                onClick={() => {
                  const amount = selectedOrder.total - getTotalPaid();
                  if (amount > 0) {
                    addPaymentMethod('card', amount);
                  }
                }}
                className="flex flex-col items-center p-4 rounded-lg border-2 border-dashed border-blue-300 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors"
              >
                <CreditCard className="w-8 h-8 text-blue-600 mb-2" />
                <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Tarjeta
                </span>
              </button>

              <button
                onClick={() => {
                  const amount = selectedOrder.total - getTotalPaid();
                  if (amount > 0) {
                    addPaymentMethod('transfer', amount);
                  }
                }}
                className="flex flex-col items-center p-4 rounded-lg border-2 border-dashed border-purple-300 hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900 transition-colors"
              >
                <Smartphone className="w-8 h-8 text-purple-600 mb-2" />
                <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Transferencia
                </span>
              </button>
            </div>

            {/* Payment Summary */}
            {paymentMethods.length > 0 && (
              <div className={`p-4 rounded-lg mb-6 ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <h4 className={`font-semibold mb-3 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Métodos de Pago
                </h4>
                <div className="space-y-2">
                  {paymentMethods.map((payment) => (
                    <div key={payment.id} className="flex justify-between items-center">
                      <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {payment.type === 'cash' ? 'Efectivo' : 
                         payment.type === 'card' ? 'Tarjeta' : 'Transferencia'}
                      </span>
                      <div className="flex items-center space-x-2">
                        <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          ${payment.amount.toFixed(2)}
                        </span>
                        <button
                          onClick={() => setPaymentMethods(prev => prev.filter(p => p.id !== payment.id))}
                          className="text-red-500 hover:text-red-700"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="border-t pt-2 mt-3 border-gray-300 dark:border-gray-600">
                  <div className="flex justify-between font-bold">
                    <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>Total Pagado:</span>
                    <span className="text-blue-600">${getTotalPaid().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>Restante:</span>
                    <span className="text-red-600">${(selectedOrder.total - getTotalPaid()).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Cash Input */}
            {paymentMethods.some(p => p.type === 'cash') && (
              <div className="mb-6">
                <label className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Efectivo Recibido
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={cashReceived}
                  onChange={(e) => setCashReceived(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="0.00"
                />
                {getChange() > 0 && (
                  <p className="mt-2 text-green-600 font-medium">
                    Cambio: ${getChange().toFixed(2)}
                  </p>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex space-x-3">
              <button
                onClick={() => setShowPaymentModal(false)}
                className={`flex-1 py-3 px-4 rounded-lg border transition-colors ${
                  isDarkMode 
                    ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Cancelar
              </button>
              <button
                onClick={handleCompletePayment}
                disabled={getTotalPaid() < selectedOrder.total}
                className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg transition-colors font-medium"
              >
                Completar Pago
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Modal */}
      {showInvoice && paidOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">FACTURA</h2>
              <div className="text-sm text-gray-600 space-y-1">
                <p>RESTAURANTE TOAST POS</p>
                <p>Calle Principal #123</p>
                <p>Tel: (555) 123-4567</p>
                <p>RIF: J-12345678-9</p>
              </div>
            </div>

            <div className="border-t border-b border-gray-300 py-4 mb-4 text-sm">
              <div className="flex justify-between mb-2">
                <span>Factura #:</span>
                <span className="font-mono">{paidOrder.id.slice(-8).toUpperCase()}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Mesa:</span>
                <span>{tables.find(t => t.id === paidOrder.tableId)?.number}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Fecha:</span>
                <span>{new Date().toLocaleDateString('es-ES')}</span>
              </div>
              <div className="flex justify-between">
                <span>Hora:</span>
                <span>{new Date().toLocaleTimeString('es-ES')}</span>
              </div>
            </div>

            <div className="mb-4">
              <div className="text-xs font-bold mb-2 flex justify-between border-b pb-1">
                <span>DESCRIPCIÓN</span>
                <span>CANT</span>
                <span>PRECIO</span>
                <span>TOTAL</span>
              </div>
              {paidOrder.items.map((item) => (
                <div key={item.id} className="text-xs py-1">
                  <div className="flex justify-between">
                    <span className="flex-1 truncate">{item.product.name}</span>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <span className="w-12 text-right">${item.product.price.toFixed(2)}</span>
                    <span className="w-12 text-right font-mono">${(item.product.price * item.quantity).toFixed(2)}</span>
                  </div>
                  {item.modifiers.length > 0 && (
                    <div className="text-gray-500 ml-2">
                      {item.modifiers.map(m => `+ ${m.name}`).join(', ')}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="border-t border-gray-300 pt-2 mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Subtotal:</span>
                <span className="font-mono">{formatCurrency(paidOrder.total / 1.16, currency)}</span>
              </div>
              <div className="flex justify-between text-sm mb-1">
                <span>IVA (16%):</span>
                <span className="font-mono">{formatCurrency(paidOrder.total * 0.16 / 1.16, currency)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-1">
                <span>TOTAL:</span>
                <span className="font-mono">{formatCurrency(paidOrder.total, currency)}</span>
              </div>
            </div>

            <div className="text-center text-xs text-gray-600 mb-4">
              <p>¡Gracias por su visita!</p>
              <p>Vuelva pronto</p>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowInvoice(false);
                  setPaidOrder(null);
                }}
                className="flex-1 py-2 px-4 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cerrar
              </button>
              <button
                onClick={() => window.print()}
                className="flex-1 flex items-center justify-center space-x-2 bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded-lg transition-colors"
              >
                <Printer size={16} />
                <span>Imprimir</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}