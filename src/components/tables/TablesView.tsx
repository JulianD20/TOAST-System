import React, { useState } from 'react';
import { Plus, Edit, Trash2, Users, RotateCcw, MapPin, Clock, Utensils } from 'lucide-react';
import { usePOS } from '../../contexts/POSContext';
import { useAuth } from '../../contexts/AuthContext';
import { Table } from '../../types';

export function TablesView() {
  const { tables, updateTable, addTable, createOrder, isDarkMode, resetTableStatus } = usePOS();
  const { user } = useAuth();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTable, setEditingTable] = useState<Table | null>(null);
  const [selectedZone, setSelectedZone] = useState('Todas');

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
        x: 50 + (tables.length * 120),
        y: 50 + (Math.floor(tables.length / 5) * 150),
        width: 80,
        height: 80,
      });
      setNewTable({ number: '', capacity: '', zone: '' });
      setShowAddModal(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-emerald-500 border-emerald-400 shadow-emerald-200';
      case 'occupied':
        return 'bg-red-500 border-red-400 shadow-red-200';
      case 'reserved':
        return 'bg-amber-500 border-amber-400 shadow-amber-200';
      case 'dirty':
        return 'bg-gray-500 border-gray-400 shadow-gray-200';
      default:
        return 'bg-gray-400 border-gray-300 shadow-gray-200';
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
        return 'Necesita Limpieza';
      default:
        return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available':
        return <Utensils className="w-4 h-4 text-white" />;
      case 'occupied':
        return <Users className="w-4 h-4 text-white" />;
      case 'reserved':
        return <Clock className="w-4 h-4 text-white" />;
      case 'dirty':
        return <RotateCcw className="w-4 h-4 text-white" />;
      default:
        return <Utensils className="w-4 h-4 text-white" />;
    }
  };

  const zones = ['Todas', ...new Set(tables.map(t => t.zone))];
  const filteredTables = selectedZone === 'Todas' 
    ? tables 
    : tables.filter(t => t.zone === selectedZone);

  const getTableStats = () => {
    return {
      available: tables.filter(t => t.status === 'available').length,
      occupied: tables.filter(t => t.status === 'occupied').length,
      reserved: tables.filter(t => t.status === 'reserved').length,
      dirty: tables.filter(t => t.status === 'dirty').length,
      total: tables.length
    };
  };

  const stats = getTableStats();

  return (
    <div className="space-y-8">
      {/* Header with Enhanced Design */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-500 via-red-500 to-pink-600 p-8 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                Plano del Restaurante
              </h1>
              <p className="text-orange-100 text-lg">
                Gestiona y visualiza el estado de todas las mesas
              </p>
            </div>
            
            {user?.role === 'admin' && (
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 border border-white/20"
              >
                <Plus size={20} />
                <span>Agregar Mesa</span>
              </button>
            )}
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-4 right-4 w-32 h-32 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-4 left-4 w-24 h-24 bg-white/5 rounded-full blur-2xl"></div>
      </div>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className={`p-6 rounded-2xl shadow-lg border ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
        }`}>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-600 dark:text-gray-300 mb-1">
              {stats.total}
            </div>
            <div className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Total Mesas
            </div>
          </div>
        </div>

        <div className={`p-6 rounded-2xl shadow-lg border ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
        }`}>
          <div className="text-center">
            <div className="text-3xl font-bold text-emerald-600 mb-1">
              {stats.available}
            </div>
            <div className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Disponibles
            </div>
          </div>
        </div>

        <div className={`p-6 rounded-2xl shadow-lg border ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
        }`}>
          <div className="text-center">
            <div className="text-3xl font-bold text-red-600 mb-1">
              {stats.occupied}
            </div>
            <div className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Ocupadas
            </div>
          </div>
        </div>

        <div className={`p-6 rounded-2xl shadow-lg border ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
        }`}>
          <div className="text-center">
            <div className="text-3xl font-bold text-amber-600 mb-1">
              {stats.reserved}
            </div>
            <div className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Reservadas
            </div>
          </div>
        </div>

        <div className={`p-6 rounded-2xl shadow-lg border ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
        }`}>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-600 mb-1">
              {stats.dirty}
            </div>
            <div className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Por Limpiar
            </div>
          </div>
        </div>
      </div>

      {/* Zone Filter */}
      <div className="flex flex-wrap gap-3">
        {zones.map((zone) => (
          <button
            key={zone}
            onClick={() => setSelectedZone(zone)}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
              selectedZone === zone
                ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                : isDarkMode
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 shadow-sm'
            }`}
          >
            <MapPin className="w-4 h-4 inline mr-2" />
            {zone}
          </button>
        ))}
      </div>

      {/* Restaurant Floor Plan */}
      <div className={`relative rounded-3xl shadow-2xl overflow-hidden ${
        isDarkMode ? 'bg-gray-800' : 'bg-gradient-to-br from-slate-50 to-blue-50'
      }`}>
        {/* Floor Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="grid grid-cols-20 grid-rows-20 h-full w-full">
            {Array.from({ length: 400 }).map((_, i) => (
              <div key={i} className="border border-gray-400"></div>
            ))}
          </div>
        </div>

        {/* Restaurant Layout */}
        <div className="relative p-12 min-h-[800px]">
          {/* Zone Labels */}
          <div className="absolute top-6 left-6 right-6 flex justify-between">
            {zones.slice(1).map((zone, index) => (
              <div
                key={zone}
                className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                  isDarkMode 
                    ? 'bg-gray-700 text-gray-300' 
                    : 'bg-white/80 text-gray-700 shadow-sm'
                }`}
              >
                {zone}
              </div>
            ))}
          </div>

          {/* Tables Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 mt-16">
            {filteredTables.map((table) => (
              <div
                key={table.id}
                className="group relative"
              >
                {/* Table Card */}
                <div 
                  className={`relative cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                    table.capacity <= 2 ? 'w-24 h-24' : 
                    table.capacity <= 4 ? 'w-28 h-28' : 'w-32 h-32'
                  }`}
                  onClick={() => handleTableClick(table)}
                >
                  {/* Table Surface with Enhanced Design */}
                  <div className={`w-full h-full rounded-2xl border-4 flex items-center justify-center shadow-lg transition-all duration-300 ${
                    getStatusColor(table.status)
                  } ${
                    table.status === 'available' 
                      ? 'hover:shadow-emerald-300 hover:shadow-xl' 
                      : table.status === 'occupied'
                      ? 'hover:shadow-red-300 hover:shadow-xl'
                      : table.status === 'reserved'
                      ? 'hover:shadow-amber-300 hover:shadow-xl'
                      : 'hover:shadow-gray-300 hover:shadow-xl'
                  }`}>
                    
                    {/* Table Number and Icon */}
                    <div className="text-center text-white">
                      <div className="text-2xl font-bold mb-1">
                        {table.number}
                      </div>
                      {getStatusIcon(table.status)}
                    </div>

                    {/* Animated Pulse for Available Tables */}
                    {table.status === 'available' && (
                      <div className="absolute inset-0 rounded-2xl bg-emerald-400 opacity-20 animate-pulse"></div>
                    )}
                  </div>
                  
                  {/* Chairs around table with better positioning */}
                  {Array.from({ length: table.capacity }).map((_, i) => {
                    const angle = (360 / table.capacity) * i;
                    const radius = table.capacity <= 2 ? 50 : table.capacity <= 4 ? 58 : 66;
                    const x = Math.cos((angle - 90) * Math.PI / 180) * radius;
                    const y = Math.sin((angle - 90) * Math.PI / 180) * radius;
                    
                    return (
                      <div
                        key={i}
                        className="absolute w-4 h-7 bg-gradient-to-b from-amber-600 to-amber-800 rounded-md shadow-md transition-all duration-300 group-hover:shadow-lg"
                        style={{
                          left: `calc(50% + ${x}px - 8px)`,
                          top: `calc(50% + ${y}px - 14px)`,
                          transform: `rotate(${angle}deg)`,
                        }}
                      />
                    );
                  })}
                  
                  {/* Status Badge */}
                  <div className={`absolute -top-3 -right-3 w-6 h-6 rounded-full border-3 border-white shadow-lg ${
                    table.status === 'available' ? 'bg-emerald-500' :
                    table.status === 'occupied' ? 'bg-red-500' :
                    table.status === 'reserved' ? 'bg-amber-500' : 'bg-gray-500'
                  }`}>
                    <div className="absolute inset-1 rounded-full bg-white/30"></div>
                  </div>
                  
                  {/* Reset button for occupied tables */}
                  {table.status === 'occupied' && user?.role === 'admin' && (
                    <button
                      onClick={(e) => handleResetTable(e, table.id)}
                      className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-orange-600 hover:bg-orange-700 text-white p-2 rounded-full shadow-lg hover:shadow-xl"
                    >
                      <RotateCcw size={14} />
                    </button>
                  )}
                </div>
                
                {/* Table Information Card */}
                <div className={`absolute -bottom-20 left-1/2 transform -translate-x-1/2 w-40 p-3 rounded-xl shadow-lg border opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 ${
                  isDarkMode 
                    ? 'bg-gray-800 border-gray-700 text-white' 
                    : 'bg-white border-gray-200 text-gray-900'
                }`}>
                  <div className="text-center">
                    <div className="font-bold text-lg mb-1">Mesa {table.number}</div>
                    <div className={`text-sm mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      <MapPin className="w-3 h-3 inline mr-1" />
                      {table.zone}
                    </div>
                    <div className={`text-sm mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      <Users className="w-3 h-3 inline mr-1" />
                      {table.capacity} personas
                    </div>
                    <div className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      table.status === 'available' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-800 dark:text-emerald-100' :
                      table.status === 'occupied' ? 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100' :
                      table.status === 'reserved' ? 'bg-amber-100 text-amber-800 dark:bg-amber-800 dark:text-amber-100' :
                      'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100'
                    }`}>
                      {getStatusText(table.status)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Legend */}
      <div className={`p-8 rounded-2xl shadow-lg ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <h3 className={`font-bold text-xl mb-6 ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>
          Leyenda del Estado de Mesas
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-6 h-6 bg-emerald-500 rounded-lg shadow-md"></div>
            <div>
              <div className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Disponible
              </div>
              <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Lista para nuevos clientes
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-6 h-6 bg-red-500 rounded-lg shadow-md"></div>
            <div>
              <div className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Ocupada
              </div>
              <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Clientes actualmente sentados
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-6 h-6 bg-amber-500 rounded-lg shadow-md"></div>
            <div>
              <div className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Reservada
              </div>
              <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Reservación confirmada
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-6 h-6 bg-gray-500 rounded-lg shadow-md"></div>
            <div>
              <div className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Por Limpiar
              </div>
              <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Necesita ser preparada
              </div>
            </div>
          </div>
        </div>
        
        {user?.role === 'waiter' && (
          <div className={`mt-6 p-4 rounded-xl ${
            isDarkMode ? 'bg-gray-700' : 'bg-orange-50'
          }`}>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                <Utensils className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Instrucciones para Meseros
                </div>
                <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Haz clic en una mesa disponible (verde) para comenzar un nuevo pedido
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Table Modal - Enhanced */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className={`p-8 rounded-3xl shadow-2xl max-w-md w-full mx-4 ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <h3 className={`text-2xl font-bold mb-6 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Agregar Nueva Mesa
            </h3>
            
            <div className="space-y-6">
              <div>
                <label className={`block text-sm font-semibold mb-3 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Número de Mesa
                </label>
                <input
                  type="number"
                  value={newTable.number}
                  onChange={(e) => setNewTable({...newTable, number: e.target.value})}
                  className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-gray-50 border-gray-200 text-gray-900'
                  }`}
                  placeholder="Ej: 15"
                />
              </div>
              
              <div>
                <label className={`block text-sm font-semibold mb-3 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Capacidad
                </label>
                <input
                  type="number"
                  value={newTable.capacity}
                  onChange={(e) => setNewTable({...newTable, capacity: e.target.value})}
                  className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-gray-50 border-gray-200 text-gray-900'
                  }`}
                  placeholder="Ej: 4"
                />
              </div>
              
              <div>
                <label className={`block text-sm font-semibold mb-3 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Zona
                </label>
                <select
                  value={newTable.zone}
                  onChange={(e) => setNewTable({...newTable, zone: e.target.value})}
                  className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-gray-50 border-gray-200 text-gray-900'
                  }`}
                >
                  <option value="">Seleccionar zona</option>
                  <option value="Salón Principal">Salón Principal</option>
                  <option value="Terraza">Terraza</option>
                  <option value="Barra">Barra</option>
                  <option value="VIP">Área VIP</option>
                  <option value="Jardín">Jardín</option>
                </select>
              </div>
            </div>
            
            <div className="flex space-x-4 mt-8">
              <button
                onClick={() => setShowAddModal(false)}
                className={`flex-1 py-3 px-6 rounded-xl border-2 font-semibold transition-all ${
                  isDarkMode 
                    ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Cancelar
              </button>
              <button
                onClick={handleAddTable}
                className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-3 px-6 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl"
              >
                Agregar Mesa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}