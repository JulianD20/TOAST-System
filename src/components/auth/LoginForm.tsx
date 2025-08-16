import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { usePOS } from '../../contexts/POSContext';
import { User, Lock, Eye, EyeOff, ChefHat, Calculator, Users, Settings, ArrowLeft } from 'lucide-react';

interface LoginFormProps {
  onBackToLanding?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onBackToLanding }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { addNotification } = usePOS();

  const demoUsers = [
    { username: 'admin', password: 'admin123', role: 'admin', icon: Settings, color: 'bg-purple-500', description: 'Acceso completo al sistema' },
    { username: 'mesero', password: 'mesero123', role: 'waiter', icon: User, color: 'bg-blue-500', description: 'Tomar pedidos y gestionar mesas' },
    { username: 'chef', password: 'chef123', role: 'kitchen', icon: ChefHat, color: 'bg-green-500', description: 'Gestionar cocina y pedidos' },
    { username: 'cajero', password: 'cajero123', role: 'cashier', icon: Calculator, color: 'bg-orange-500', description: 'Procesar pagos y facturas' },
    { username: 'host', password: 'host123', role: 'host', icon: Users, color: 'bg-pink-500', description: 'Gestionar reservas y mesas' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const user = demoUsers.find(u => u.username === username && u.password === password);
      
      if (user) {
        await login(username, password);
        addNotification(`¡Bienvenido ${user.role}!`, 'success');
      } else {
        addNotification('Credenciales incorrectas', 'error');
      }
    } catch (error) {
      addNotification('Error al iniciar sesión', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = (user: typeof demoUsers[0]) => {
    setUsername(user.username);
    setPassword(user.password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Login Form */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 backdrop-blur-sm bg-opacity-95">
          {/* Back to Landing Button */}
          {onBackToLanding && (
            <button
              onClick={onBackToLanding}
              className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 transition-colors mb-6 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Volver al inicio</span>
            </button>
          )}
          
          <div className="text-center mb-8">
            <div 
              className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mb-4 shadow-lg cursor-pointer hover:scale-110 transition-transform"
              onClick={onBackToLanding}
            >
              <ChefHat className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">RestaurantPOS</h1>
            <p className="text-gray-600 dark:text-gray-300">Sistema integral para restaurantes</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Usuario"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
                  required
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-4 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] transition-all duration-200 shadow-lg"
            >
              {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </form>
        </div>

        {/* Right Side - Demo Users */}
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Usuarios Demo</h2>
            <p className="text-gray-600 dark:text-gray-300">Haz clic en cualquier usuario para probar el sistema</p>
          </div>

          <div className="grid gap-4">
            {demoUsers.map((user) => {
              const IconComponent = user.icon;
              return (
                <div
                  key={user.username}
                  onClick={() => handleDemoLogin(user)}
                  className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg hover:shadow-xl cursor-pointer transform hover:scale-[1.02] transition-all duration-200 border border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-600"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`${user.color} p-3 rounded-lg shadow-md`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white capitalize">{user.role}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{user.description}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Usuario: {user.username} | Contraseña: {user.password}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl p-6 border border-orange-200 dark:border-orange-800">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Características del Sistema:</h3>
            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span>Gestión completa de pedidos</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span>Control de inventario en tiempo real</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span>Reportes y análisis detallados</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span>Gestión de mesas y reservas</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};