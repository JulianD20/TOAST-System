import React, { useState } from 'react';
import { RotateCcw, CheckCircle, Clock, AlertTriangle, Users } from 'lucide-react';
import { usePOS } from '../../contexts/POSContext';
import { useAuth } from '../../contexts/AuthContext';
import { Table } from '../../types';

export function TableManagementView() {
  const { tables, updateTable, isDarkMode, addNotification } = usePOS();
  const { user } = useAuth();
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);

  const handleUpdateTableStatus = (tableId: string, newStatus: Table['status']) => {
    const table = tables.find(t => t.id === tableId);
    if (table) {
      updateTable({
        ...table,
        status: newStatus,
        currentOrder: newStatus === 'available' ? undefined : table.currentOrder,
      });
      addNotification(
        `Mesa ${table.number} marcada como ${getStatusText(newStatus)}`, 
        'success'
      );
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available': return 'disponible';
      case 'occupied': return 'ocupada';
      case 'reserved': return 'reservada';
      case 'dirty': return 'sucia';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100';
      case 'occupied': return 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100';
      case 'reserved': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100';
      case 'dirty': return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available': return <CheckCircle size={16} className="text-green-600" />;
      case 'occupied': return <Users size={16} className="text-red-600" />;
      case 'reserved': return <Clock size={16} className="text-yellow-600" />;
      case 'dirty': return <AlertTriangle size={16} className="text-gray-600" />;
      default: return <AlertTriangle size={16} className="text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className={`text-3xl font-bold ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>
          Gestión de Estados de Mesa
        </h1>
        <p className={`mt-2 ${
          isDarkMode ? 'text-gray-400' : 'text-gray-600'
        }`}>
          Administra el estado de las mesas del restaurante
        </p>
      </div>

      {/* Tables Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tables.map((table) => (
          <div
            key={table.id}
            className={`p-6 rounded-2xl shadow-lg transition-all duration-200 ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            }`}
          >
            {/* Table Header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className={`text-xl font-bold ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Mesa {table.number}
                </h3>
                <p className={`text-sm ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {table.zone} • {table.capacity} personas
                </p>
              </div>
              
              <div className="flex items-center space-x-2">
                {getStatusIcon(table.status)}
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(table.status)}`}>
                  {getStatusText(table.status)}
                </span>
              </div>
            </div>

            {/* Status Actions */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleUpdateTableStatus(table.id, 'available')}
                disabled={table.status === 'available'}
                className="flex items-center justify-center space-x-2 py-2 px-3 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-800 dark:text-green-200 dark:hover:bg-green-700"
              >
                <CheckCircle size={16} />
                <span>Disponible</span>
              </button>

              <button
                onClick={() => handleUpdateTableStatus(table.id, 'occupied')}
                disabled={table.status === 'occupied'}
                className="flex items-center justify-center space-x-2 py-2 px-3 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-800 dark:text-red-200 dark:hover:bg-red-700"
              >
                <Users size={16} />
                <span>Ocupada</span>
              </button>

              <button
                onClick={() => handleUpdateTableStatus(table.id, 'reserved')}
                disabled={table.status === 'reserved'}
                className="flex items-center justify-center space-x-2 py-2 px-3 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-yellow-100 text-yellow-700 hover:bg-yellow-200 dark:bg-yellow-800 dark:text-yellow-200 dark:hover:bg-yellow-700"
              >
                <Clock size={16} />
                <span>Reservada</span>
              </button>

              <button
                onClick={() => handleUpdateTableStatus(table.id, 'dirty')}
                disabled={table.status === 'dirty'}
                className="flex items-center justify-center space-x-2 py-2 px-3 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
              >
                <AlertTriangle size={16} />
                <span>Sucia</span>
              </button>
            </div>

            {/* Quick Reset */}
            {table.status !== 'available' && (
              <button
                onClick={() => handleUpdateTableStatus(table.id, 'available')}
                className="w-full mt-3 flex items-center justify-center space-x-2 bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded-lg transition-colors"
              >
                <RotateCcw size={16} />
                <span>Marcar como Disponible</span>
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className={`p-6 rounded-2xl shadow-lg ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <h3 className={`text-lg font-semibold mb-4 ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>
          Resumen de Estados
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {tables.filter(t => t.status === 'available').length}
            </div>
            <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Disponibles
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {tables.filter(t => t.status === 'occupied').length}
            </div>
            <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Ocupadas
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {tables.filter(t => t.status === 'reserved').length}
            </div>
            <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Reservadas
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-600">
              {tables.filter(t => t.status === 'dirty').length}
            </div>
            <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Sucias
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}