import React, { useState } from 'react';
import { Plus, Edit, Trash2, Users, RotateCcw } from 'lucide-react';
import { usePOS } from '../../contexts/POSContext';
import { useAuth } from '../../contexts/AuthContext';
import { Table } from '../../types';

export function TablesView() {
  const { tables, updateTable, addTable, createOrder, isDarkMode } = usePOS();
  const { user } = useAuth();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTable, setEditingTable] = useState<Table | null>(null);

  const handleTableClick = (table: Table) => {
    if (user?.role === 'waiter' && table.status === 'available') {
      createOrder(table.id, user.id);
      // Navigate to POS view
      window.dispatchEvent(new CustomEvent('navigateToPOS'));
    }
  };

  const handleResetTable = (e: React.MouseEvent, tableId: string) => {
    e.stopPropagation();
    resetTableStatus(tableId);
  };

  const [newTable, setNewTable] = useState({
    number: '',
    capacity: '',
    zone: '',
  });

  const handleAddTable = () => {
    if (newTable.number && newTable.capacity && newTable.zone) {
      addTable({
        number: parseInt(newTable.number),
        capacity: parseInt(newTable.capacity),
        zone: newTable.zone,
        status: 'available',
        x: 50 + (tables.length * 120), // Space tables apart
        y: 50 + (Math.floor(tables.length / 5) * 150), // New row every 5 tables
        width: 80,
        height: 80,
      });
      setNewTable({ number: '', capacity: '', zone: '' });
      setShowAddModal(false);
    }
  };

  const getTableColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-500 hover:bg-green-600';
      case 'occupied':
        return 'bg-red-500 hover:bg-red-600';
      case 'reserved':
        return 'bg-yellow-500 hover:bg-yellow-600';
      case 'dirty':
        return 'bg-gray-500 hover:bg-gray-600';
      default:
        return 'bg-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available':
        return 'Disponible';
      case 'occupied':
        return 'Ocupada';
      case 'reserved':
        return 'Reservada';
      case 'dirty':
        return 'Sucia';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-bold ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Gestión de Mesas
          </h1>
          <p className={`mt-2 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Administra el plano y estado de las mesas del restaurante
          </p>
        </div>
        
        {user?.role === 'admin' && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus size={20} />
            <span>Agregar Mesa</span>
          </button>
        )}
      </div>

      {/* Tables Grid */}
      <div className={`p-12 rounded-2xl shadow-lg relative min-h-[700px] bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        {/* Restaurant Floor Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="grid grid-cols-24 grid-rows-24 h-full w-full">
            {Array.from({ length: 576 }).map((_, i) => (
              <div key={i} className="border border-gray-300"></div>
            ))}
          </div>
        </div>
        
        <div className="relative w-full h-full" style={{ minHeight: '600px' }}>
          {tables.map((table) => (
            <div
              key={table.id}
              className="absolute group"
              style={{
                left: `${table.x + (table.id === '1' ? 0 : parseInt(table.id) * 20)}px`,
                top: `${table.y + (Math.floor((parseInt(table.id) - 1) / 4) * 30)}px`,
              }}
            >
              {/* Table Visual */}
              <div 
                className={`relative cursor-pointer transition-all duration-200 hover:scale-105 ${
                  table.capacity <= 2 ? 'w-16 h-16' : 
                  table.capacity <= 4 ? 'w-20 h-20' : 'w-24 h-24'
                }`}
                onClick={() => handleTableClick(table)}
              >
                {/* Table Surface */}
                <div className={`w-full h-full rounded-full shadow-lg border-4 flex items-center justify-center ${
                  table.status === 'available' 
                    ? 'bg-green-100 border-green-400 hover:bg-green-200' 
                    : table.status === 'occupied'
                    ? 'bg-red-100 border-red-400 hover:bg-red-200'
                    : table.status === 'reserved'
                    ? 'bg-yellow-100 border-yellow-400 hover:bg-yellow-200'
                    : 'bg-gray-100 border-gray-400 hover:bg-gray-200'
                }`}>
                  <div className="text-center">
                    <div className={`text-lg font-bold ${
                      table.status === 'available' ? 'text-green-800' :
                      table.status === 'occupied' ? 'text-red-800' :
                      table.status === 'reserved' ? 'text-yellow-800' : 'text-gray-800'
                    }`}>
                      {table.number}
                    </div>
                  </div>
                </div>
                
                {/* Chairs around table */}
                {Array.from({ length: table.capacity }).map((_, i) => {
                  const angle = (360 / table.capacity) * i;
                  const radius = table.capacity <= 2 ? 40 : table.capacity <= 4 ? 50 : 60;
                  const x = Math.cos((angle - 90) * Math.PI / 180) * radius;
                  const y = Math.sin((angle - 90) * Math.PI / 180) * radius;
                  
                  return (
                    <div
                      key={i}
                      className="absolute w-3 h-6 bg-amber-600 rounded-sm shadow-sm"
                      style={{
                        left: `calc(50% + ${x}px - 6px)`,
                        top: `calc(50% + ${y}px - 12px)`,
                        transform: `rotate(${angle}deg)`,
                      }}
                    />
                  );
                })}
                
                {/* Status indicator */}
                <div className={`absolute -top-2 -right-2 w-4 h-4 rounded-full border-2 border-white ${
                  table.status === 'available' ? 'bg-green-500' :
                  table.status === 'occupied' ? 'bg-red-500' :
                  table.status === 'reserved' ? 'bg-yellow-500' : 'bg-gray-500'
                }`}></div>
                
                {/* Reset button for occupied tables */}
                {table.status === 'occupied' && user?.role === 'admin' && (
                  <button
                    onClick={(e) => handleResetTable(e, table.id)}
                    className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-blue-600 hover:bg-blue-700 text-white p-1 rounded-full shadow-lg"
                  >
                    <RotateCcw size={12} />
                  </button>
                )}
              </div>
              
              {/* Table info */}
              <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 text-center whitespace-nowrap">
                <div className={`text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {table.zone}
                </div>
                <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {table.capacity} personas
                </div>
                <div className={`text-xs font-semibold ${
                  table.status === 'available' ? 'text-green-600' :
                  table.status === 'occupied' ? 'text-red-600' :
                  table.status === 'reserved' ? 'text-yellow-600' : 'text-gray-600'
                }`}>
                  {getStatusText(table.status)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Table Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`p-6 rounded-2xl shadow-xl max-w-md w-full mx-4 ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <h3 className={`text-xl font-bold mb-4 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Agregar Nueva Mesa
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Número de Mesa
                </label>
                <input
                  type="number"
                  value={newTable.number}
                  onChange={(e) => setNewTable({...newTable, number: e.target.value})}
                  className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="Ej: 15"
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Capacidad
                </label>
                <input
                  type="number"
                  value={newTable.capacity}
                  onChange={(e) => setNewTable({...newTable, capacity: e.target.value})}
                  className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="Ej: 4"
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Zona
                </label>
                <select
                  value={newTable.zone}
                  onChange={(e) => setNewTable({...newTable, zone: e.target.value})}
                  className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="">Seleccionar zona</option>
                  <option value="Salón">Salón</option>
                  <option value="Terraza">Terraza</option>
                  <option value="Barra">Barra</option>
                  <option value="VIP">VIP</option>
                </select>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className={`flex-1 py-2 px-4 rounded-lg border transition-colors ${
                  isDarkMode 
                    ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Cancelar
              </button>
              <button
                onClick={handleAddTable}
                className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded-lg transition-colors"
              >
                Agregar Mesa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className={`p-4 rounded-lg ${
        isDarkMode ? 'bg-gray-800' : 'bg-gray-50'
      }`}>
        <h3 className={`font-semibold mb-3 ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>
          Leyenda:
        </h3>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
              Disponible
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
              Ocupada
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-yellow-500 rounded"></div>
            <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
              Reservada
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-500 rounded"></div>
            <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
              Sucia
            </span>
          </div>
        </div>
        {user?.role === 'waiter' && (
          <p className={`mt-2 text-sm ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Haz clic en una mesa disponible para comenzar un pedido
          </p>
        )}
      </div>
    </div>
  );
}