import React, { useState } from 'react';
import { Search, Plus, Minus, Send } from 'lucide-react';
import { usePOS } from '../../contexts/POSContext';
import { useAuth } from '../../contexts/AuthContext';
import { Product } from '../../types';
import { formatCurrency } from '../../utils/currency';

export function POSView() {
  const { 
    products, 
    currentOrder, 
    addItemToOrder, 
    updateOrderItem, 
    removeItemFromOrder,
    sendOrderToKitchen,
    isDarkMode,
    tables,
    currency
  } = usePOS();
  const { user } = useAuth();
  
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['Todos', ...new Set(products.map(p => p.category))];

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'Todos' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch && product.isActive;
  });

  const handleAddProduct = (product: Product) => {
    if (!currentOrder) return;
    
    addItemToOrder({
      productId: product.id,
      product,
      quantity: 1,
      modifiers: [],
      notes: '',
    });
  };

  const handleUpdateQuantity = (itemId: string, change: number) => {
    const item = currentOrder?.items.find(i => i.id === itemId);
    if (!item) return;
    
    const newQuantity = item.quantity + change;
    if (newQuantity <= 0) {
      removeItemFromOrder(itemId);
    } else {
      updateOrderItem(itemId, { quantity: newQuantity });
    }
  };

  const currentTable = currentOrder ? tables.find(t => t.id === currentOrder.tableId) : null;

  if (!currentOrder) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h2 className={`text-2xl font-bold mb-4 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Selecciona una mesa
          </h2>
          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
            Ve a la vista de mesas y selecciona una mesa disponible para comenzar un pedido
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      {/* Products Section */}
      <div className="lg:col-span-2 space-y-4">
        {/* Search and Categories */}
        <div className="space-y-4">
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`} />
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                isDarkMode 
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
              }`}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : isDarkMode
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {filteredProducts.map((product) => (
            <button
              key={product.id}
              onClick={() => handleAddProduct(product)}
              className={`p-4 rounded-xl border transition-all duration-200 hover:shadow-lg hover:scale-105 ${
                isDarkMode 
                  ? 'bg-gray-800 border-gray-700 hover:border-blue-500' 
                  : 'bg-white border-gray-200 hover:border-blue-500 hover:bg-blue-50'
              }`}
            >
              <div className="aspect-square rounded-lg mb-3 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className={`font-semibold text-sm mb-1 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {product.name}
              </h3>
              <p className={`text-xs mb-2 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {product.description}
              </p>
              <p className="font-bold text-blue-600">
                {formatCurrency(product.price, currency)}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Order Summary */}
      <div className={`p-6 rounded-2xl shadow-lg ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="mb-6">
          <h2 className={`text-xl font-bold ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Mesa {currentTable?.number}
          </h2>
          <p className={`text-sm ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Mesero: {user?.name}
          </p>
        </div>

        {/* Order Items */}
        <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
          {currentOrder.items.length === 0 ? (
            <p className={`text-center py-4 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              No hay productos en el pedido
            </p>
          ) : (
            currentOrder.items.map((item) => (
              <div
                key={item.id}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                }`}
              >
                <div className="flex-1">
                  <p className={`font-medium ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {item.product.name}
                  </p>
                  <p className={`text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {formatCurrency(item.product.price, currency)} c/u
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleUpdateQuantity(item.id, -1)}
                    className="w-8 h-8 rounded-full bg-red-100 text-red-600 hover:bg-red-200 flex items-center justify-center transition-colors"
                  >
                    <Minus size={14} />
                  </button>
                  <span className={`w-8 text-center font-medium ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => handleUpdateQuantity(item.id, 1)}
                    className="w-8 h-8 rounded-full bg-green-100 text-green-600 hover:bg-green-200 flex items-center justify-center transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Total */}
        <div className={`border-t pt-4 mb-6 ${
          isDarkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div className="flex justify-between items-center">
            <span className={`text-lg font-semibold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Total:
            </span>
            <span className="text-2xl font-bold text-blue-600">
              {formatCurrency(currentOrder.total, currency)}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={sendOrderToKitchen}
            disabled={currentOrder.items.length === 0}
            className="w-full flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-3 rounded-lg font-medium transition-colors"
          >
            <Send size={20} />
            <span>Enviar a Cocina</span>
          </button>
        </div>
      </div>
    </div>
  );
}