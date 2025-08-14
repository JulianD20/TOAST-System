import React, { useState } from 'react';
import { Plus, Calendar, Clock, Users, Phone, Mail, Edit, Trash2, Check, X } from 'lucide-react';
import { usePOS } from '../../contexts/POSContext';
import { Reservation } from '../../types';

export function ReservationsView() {
  const { tables, isDarkMode, addNotification, updateTable } = usePOS();
  const [reservations, setReservations] = useState<Reservation[]>([
    {
      id: '1',
      customerName: 'María González',
      customerPhone: '+58 414-123-4567',
      customerEmail: 'maria@email.com',
      tableId: '1',
      date: new Date(),
      time: '19:30',
      partySize: 4,
      status: 'confirmed',
      notes: 'Cumpleaños, necesita decoración especial',
      createdAt: new Date(),
    },
    {
      id: '2',
      customerName: 'Carlos Rodríguez',
      customerPhone: '+58 424-987-6543',
      tableId: '3',
      date: new Date(Date.now() + 86400000), // Tomorrow
      time: '20:00',
      partySize: 2,
      status: 'confirmed',
      notes: 'Cena romántica',
      createdAt: new Date(),
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingReservation, setEditingReservation] = useState<Reservation | null>(null);
  const [newReservation, setNewReservation] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    tableId: '',
    date: new Date().toISOString().split('T')[0],
    time: '',
    partySize: 2,
    notes: '',
  });

  const handleAddReservation = () => {
    if (newReservation.customerName && newReservation.customerPhone && newReservation.tableId && newReservation.time) {
      const reservation: Reservation = {
        id: Date.now().toString(),
        customerName: newReservation.customerName,
        customerPhone: newReservation.customerPhone,
        customerEmail: newReservation.customerEmail,
        tableId: newReservation.tableId,
        date: new Date(newReservation.date),
        time: newReservation.time,
        partySize: newReservation.partySize,
        status: 'confirmed',
        notes: newReservation.notes,
        createdAt: new Date(),
      };
      
      setReservations(prev => [...prev, reservation]);
      
      // Mark table as reserved
      const table = tables.find(t => t.id === newReservation.tableId);
      if (table) {
        updateTable({ ...table, status: 'reserved' });
      }
      
      addNotification(`Reserva creada para ${newReservation.customerName}`, 'success');
      setNewReservation({
        customerName: '',
        customerPhone: '',
        customerEmail: '',
        tableId: '',
        date: new Date().toISOString().split('T')[0],
        time: '',
        partySize: 2,
        notes: '',
      });
      setShowAddModal(false);
    }
  };

  const handleSeatReservation = (reservationId: string) => {
    const reservation = reservations.find(r => r.id === reservationId);
    if (reservation) {
      setReservations(prev => prev.map(r => 
        r.id === reservationId ? { ...r, status: 'seated' as const } : r
      ));
      
      // Mark table as occupied
      const table = tables.find(t => t.id === reservation.tableId);
      if (table) {
        updateTable({ ...table, status: 'occupied' });
      }
      
      addNotification(`${reservation.customerName} ha sido sentado en Mesa ${table?.number}`, 'success');
    }
  };

  const handleCancelReservation = (reservationId: string) => {
    const reservation = reservations.find(r => r.id === reservationId);
    if (reservation) {
      setReservations(prev => prev.map(r => 
        r.id === reservationId ? { ...r, status: 'cancelled' as const } : r
      ));
      
      // Mark table as available
      const table = tables.find(t => t.id === reservation.tableId);
      if (table && table.status === 'reserved') {
        updateTable({ ...table, status: 'available' });
      }
      
      addNotification(`Reserva de ${reservation.customerName} cancelada`, 'info');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100';
      case 'seated': return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100';
      case 'completed': return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100';
      case 'no-show': return 'bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-100';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Confirmada';
      case 'seated': return 'Sentados';
      case 'completed': return 'Completada';
      case 'cancelled': return 'Cancelada';
      case 'no-show': return 'No Show';
      default: return status;
    }
  };

  const todayReservations = reservations.filter(r => {
    const today = new Date();
    const reservationDate = new Date(r.date);
    return reservationDate.toDateString() === today.toDateString();
  });

  const upcomingReservations = reservations.filter(r => {
    const today = new Date();
    const reservationDate = new Date(r.date);
    return reservationDate > today;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-bold ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Sistema de Reservas
          </h1>
          <p className={`mt-2 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Gestiona las reservas del restaurante
          </p>
        </div>
        
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={20} />
          <span>Nueva Reserva</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className={`p-6 rounded-2xl shadow-lg ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Hoy
              </p>
              <p className={`text-2xl font-bold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {todayReservations.length}
              </p>
            </div>
            <Calendar className="w-8 h-8 text-blue-600" />
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
                Confirmadas
              </p>
              <p className={`text-2xl font-bold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {reservations.filter(r => r.status === 'confirmed').length}
              </p>
            </div>
            <Check className="w-8 h-8 text-green-600" />
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
                Sentados
              </p>
              <p className={`text-2xl font-bold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {reservations.filter(r => r.status === 'seated').length}
              </p>
            </div>
            <Users className="w-8 h-8 text-purple-600" />
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
                Próximas
              </p>
              <p className={`text-2xl font-bold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {upcomingReservations.length}
              </p>
            </div>
            <Clock className="w-8 h-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Today's Reservations */}
      <div className={`p-6 rounded-2xl shadow-lg ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <h2 className={`text-xl font-semibold mb-4 ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>
          Reservas de Hoy
        </h2>

        {todayReservations.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className={`w-16 h-16 mx-auto mb-4 ${
              isDarkMode ? 'text-gray-600' : 'text-gray-400'
            }`} />
            <h3 className={`text-lg font-semibold mb-2 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              No hay reservas para hoy
            </h3>
            <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
              Las reservas de hoy aparecerán aquí
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {todayReservations.map((reservation) => {
              const table = tables.find(t => t.id === reservation.tableId);
              return (
                <div
                  key={reservation.id}
                  className={`p-4 rounded-xl border transition-all duration-200 ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600' 
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className={`font-semibold ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {reservation.customerName}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(reservation.status)}`}>
                      {getStatusText(reservation.status)}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center space-x-2 text-sm">
                      <Clock size={14} className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />
                      <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                        {reservation.time}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Users size={14} className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />
                      <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                        {reservation.partySize} personas - Mesa {table?.number}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Phone size={14} className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />
                      <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                        {reservation.customerPhone}
                      </span>
                    </div>
                    {reservation.notes && (
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        "{reservation.notes}"
                      </p>
                    )}
                  </div>

                  {reservation.status === 'confirmed' && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleSeatReservation(reservation.id)}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded-lg text-sm transition-colors"
                      >
                        Sentar
                      </button>
                      <button
                        onClick={() => handleCancelReservation(reservation.id)}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded-lg text-sm transition-colors"
                      >
                        Cancelar
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* All Reservations */}
      <div className={`p-6 rounded-2xl shadow-lg ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <h2 className={`text-xl font-semibold mb-4 ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>
          Todas las Reservas
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b ${
                isDarkMode ? 'border-gray-700' : 'border-gray-200'
              }`}>
                <th className={`text-left py-3 px-4 font-medium ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Cliente
                </th>
                <th className={`text-left py-3 px-4 font-medium ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Fecha/Hora
                </th>
                <th className={`text-left py-3 px-4 font-medium ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Mesa
                </th>
                <th className={`text-left py-3 px-4 font-medium ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Personas
                </th>
                <th className={`text-left py-3 px-4 font-medium ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Estado
                </th>
                <th className={`text-left py-3 px-4 font-medium ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((reservation) => {
                const table = tables.find(t => t.id === reservation.tableId);
                return (
                  <tr key={reservation.id} className={`border-b ${
                    isDarkMode ? 'border-gray-700' : 'border-gray-200'
                  }`}>
                    <td className={`py-3 px-4 ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      <div>
                        <div className="font-medium">{reservation.customerName}</div>
                        <div className={`text-sm ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          {reservation.customerPhone}
                        </div>
                      </div>
                    </td>
                    <td className={`py-3 px-4 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      <div>
                        <div>{new Date(reservation.date).toLocaleDateString()}</div>
                        <div className="text-sm">{reservation.time}</div>
                      </div>
                    </td>
                    <td className={`py-3 px-4 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Mesa {table?.number}
                    </td>
                    <td className={`py-3 px-4 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {reservation.partySize}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(reservation.status)}`}>
                        {getStatusText(reservation.status)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        {reservation.status === 'confirmed' && (
                          <>
                            <button
                              onClick={() => handleSeatReservation(reservation.id)}
                              className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                            >
                              <Check size={16} />
                            </button>
                            <button
                              onClick={() => handleCancelReservation(reservation.id)}
                              className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                            >
                              <X size={16} />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => setEditingReservation(reservation)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          <Edit size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Reservation Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`p-6 rounded-2xl shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <h3 className={`text-xl font-bold mb-4 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Nueva Reserva
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Nombre del Cliente
                </label>
                <input
                  type="text"
                  value={newReservation.customerName}
                  onChange={(e) => setNewReservation({...newReservation, customerName: e.target.value})}
                  className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="Nombre completo"
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Teléfono
                </label>
                <input
                  type="tel"
                  value={newReservation.customerPhone}
                  onChange={(e) => setNewReservation({...newReservation, customerPhone: e.target.value})}
                  className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="+58 414-123-4567"
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Email (opcional)
                </label>
                <input
                  type="email"
                  value={newReservation.customerEmail}
                  onChange={(e) => setNewReservation({...newReservation, customerEmail: e.target.value})}
                  className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="email@ejemplo.com"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Fecha
                  </label>
                  <input
                    type="date"
                    value={newReservation.date}
                    onChange={(e) => setNewReservation({...newReservation, date: e.target.value})}
                    className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </div>
                
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Hora
                  </label>
                  <input
                    type="time"
                    value={newReservation.time}
                    onChange={(e) => setNewReservation({...newReservation, time: e.target.value})}
                    className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Mesa
                  </label>
                  <select
                    value={newReservation.tableId}
                    onChange={(e) => setNewReservation({...newReservation, tableId: e.target.value})}
                    className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    <option value="">Seleccionar mesa</option>
                    {tables.filter(t => t.status === 'available').map(table => (
                      <option key={table.id} value={table.id}>
                        Mesa {table.number} ({table.capacity} personas)
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Personas
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="12"
                    value={newReservation.partySize}
                    onChange={(e) => setNewReservation({...newReservation, partySize: parseInt(e.target.value)})}
                    className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </div>
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Notas (opcional)
                </label>
                <textarea
                  value={newReservation.notes}
                  onChange={(e) => setNewReservation({...newReservation, notes: e.target.value})}
                  className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  rows={3}
                  placeholder="Ocasión especial, alergias, etc."
                />
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
                onClick={handleAddReservation}
                className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded-lg transition-colors"
              >
                Crear Reserva
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}