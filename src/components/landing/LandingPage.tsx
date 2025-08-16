import React, { useState, useEffect } from 'react';
import { 
  ChefHat, 
  TrendingUp, 
  Users, 
  Clock, 
  Shield, 
  Smartphone,
  BarChart3,
  CheckCircle,
  Star,
  ArrowRight,
  Menu,
  X,
  Play
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [countersStarted, setCountersStarted] = useState(false);
  const [animatedStats, setAnimatedStats] = useState({
    restaurants: 0,
    salesIncrease: 0,
    errorReduction: 0,
    support: 0
  });

  useEffect(() => {
    setIsVisible(true);
    
    // Start counter animations after a delay
    const timer = setTimeout(() => {
      setCountersStarted(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Counter animation effect
  useEffect(() => {
    if (!countersStarted) return;

    const duration = 2000; // 2 seconds
    const steps = 60; // 60 steps for smooth animation
    const stepTime = duration / steps;

    const targets = {
      restaurants: 500,
      salesIncrease: 40,
      errorReduction: 60,
      support: 24
    };

    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      const easeOutQuart = 1 - Math.pow(1 - progress, 4); // Easing function

      setAnimatedStats({
        restaurants: Math.floor(targets.restaurants * easeOutQuart),
        salesIncrease: Math.floor(targets.salesIncrease * easeOutQuart),
        errorReduction: Math.floor(targets.errorReduction * easeOutQuart),
        support: Math.floor(targets.support * easeOutQuart)
      });

      if (currentStep >= steps) {
        clearInterval(timer);
        setAnimatedStats(targets); // Ensure final values are exact
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [countersStarted]);

  const features = [
    {
      icon: TrendingUp,
      title: "Aumenta tus Ventas",
      description: "Incrementa tus ingresos hasta un 40% con nuestro sistema optimizado de gestión de pedidos.",
      color: "from-green-500 to-emerald-600"
    },
    {
      icon: Clock,
      title: "Ahorra Tiempo",
      description: "Reduce el tiempo de servicio en un 60% con automatización inteligente y flujos optimizados.",
      color: "from-blue-500 to-cyan-600"
    },
    {
      icon: Users,
      title: "Mejora la Experiencia",
      description: "Ofrece un servicio excepcional con gestión de mesas, reservas y seguimiento de pedidos.",
      color: "from-purple-500 to-pink-600"
    },
    {
      icon: BarChart3,
      title: "Reportes Inteligentes",
      description: "Toma decisiones informadas con análisis detallados de ventas, productos y rendimiento.",
      color: "from-orange-500 to-red-600"
    },
    {
      icon: Shield,
      title: "Seguro y Confiable",
      description: "Protege tu información con encriptación de nivel empresarial y respaldos automáticos.",
      color: "from-indigo-500 to-purple-600"
    },
    {
      icon: Smartphone,
      title: "Acceso Móvil",
      description: "Gestiona tu restaurante desde cualquier dispositivo con nuestra interfaz responsive.",
      color: "from-pink-500 to-rose-600"
    }
  ];

  const testimonials = [
    {
      name: "María González",
      restaurant: "La Cocina de María",
      image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
      rating: 5,
      text: "RestaurantPOS transformó completamente nuestro negocio. Las ventas aumentaron 35% en solo 3 meses."
    },
    {
      name: "Carlos Rodríguez",
      restaurant: "El Asador Premium",
      image: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
      rating: 5,
      text: "La gestión de mesas y reservas es increíble. Nuestros clientes están más satisfechos que nunca."
    },
    {
      name: "Ana Martínez",
      restaurant: "Café Central",
      image: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
      rating: 5,
      text: "Los reportes nos ayudaron a identificar nuestros productos más rentables. ¡Excelente inversión!"
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm z-50 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 p-2 rounded-lg">
                <ChefHat className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">RestaurantPOS</span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 dark:text-gray-300 hover:text-orange-500 transition-colors">Características</a>
              <a href="#benefits" className="text-gray-700 dark:text-gray-300 hover:text-orange-500 transition-colors">Beneficios</a>
              <a href="#testimonials" className="text-gray-700 dark:text-gray-300 hover:text-orange-500 transition-colors">Testimonios</a>
              <button
                onClick={onGetStarted}
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transform hover:scale-105 transition-all duration-200"
              >
                Ver Demo
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-800">
              <div className="flex flex-col space-y-4">
                <a href="#features" className="text-gray-700 dark:text-gray-300 hover:text-orange-500 transition-colors">Características</a>
                <a href="#benefits" className="text-gray-700 dark:text-gray-300 hover:text-orange-500 transition-colors">Beneficios</a>
                <a href="#testimonials" className="text-gray-700 dark:text-gray-300 hover:text-orange-500 transition-colors">Testimonios</a>
                <button
                  onClick={onGetStarted}
                  className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transform hover:scale-105 transition-all duration-200 w-full"
                >
                  Ver Demo
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                El Sistema POS que
                <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent"> Revoluciona </span>
                tu Restaurante
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                Aumenta tus ventas, reduce errores y mejora la experiencia de tus clientes con nuestro sistema integral de gestión para restaurantes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={onGetStarted}
                  className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-orange-600 hover:to-red-600 transform hover:scale-105 transition-all duration-200 shadow-lg flex items-center justify-center space-x-2"
                >
                  <Play className="w-5 h-5" />
                  <span>Ver Demo Gratis</span>
                </button>
                <button className="border-2 border-orange-500 text-orange-500 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-orange-500 hover:text-white transition-all duration-200 flex items-center justify-center space-x-2">
                  <span>Solicitar Información</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className={`transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
              <div className="relative">
                <img
                  src="https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop"
                  alt="Restaurante moderno"
                  className="rounded-2xl shadow-2xl w-full h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8" id="stats">
            <div className="text-center transform hover:scale-105 transition-all duration-300">
              <div className="text-3xl md:text-4xl font-bold text-orange-500 mb-2 tabular-nums">
                {animatedStats.restaurants}+
              </div>
              <div className="text-gray-600 dark:text-gray-300 font-medium">Restaurantes Activos</div>
            </div>
            
            <div className="text-center transform hover:scale-105 transition-all duration-300">
              <div className="text-3xl md:text-4xl font-bold text-orange-500 mb-2 tabular-nums">
                {animatedStats.salesIncrease}%
              </div>
              <div className="text-gray-600 dark:text-gray-300 font-medium">Aumento Promedio en Ventas</div>
            </div>
            
            <div className="text-center transform hover:scale-105 transition-all duration-300">
              <div className="text-3xl md:text-4xl font-bold text-orange-500 mb-2 tabular-nums">
                {animatedStats.errorReduction}%
              </div>
              <div className="text-gray-600 dark:text-gray-300 font-medium">Reducción en Errores</div>
            </div>
            
            <div className="text-center transform hover:scale-105 transition-all duration-300">
              <div className="text-3xl md:text-4xl font-bold text-orange-500 mb-2 tabular-nums">
                {animatedStats.support}/7
              </div>
              <div className="text-gray-600 dark:text-gray-300 font-medium">Soporte Técnico</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Características Poderosas
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Todo lo que necesitas para gestionar tu restaurante de manera eficiente y profesional
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div
                  key={index}
                  className={`bg-white dark:bg-gray-900 rounded-xl p-8 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-500 border border-gray-200 dark:border-gray-700 ${
                    isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${feature.color} mb-6`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-8">
                ¿Por qué elegir RestaurantPOS?
              </h2>
              <div className="space-y-6">
                {[
                  "Interfaz intuitiva que tu equipo aprenderá en minutos",
                  "Integración completa entre cocina, meseros y caja",
                  "Reportes en tiempo real para tomar mejores decisiones",
                  "Soporte técnico 24/7 en español",
                  "Actualizaciones automáticas sin costo adicional",
                  "Respaldo seguro de toda tu información"
                ].map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300 text-lg">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop"
                alt="Equipo de restaurante trabajando"
                className="rounded-2xl shadow-2xl w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Lo que dicen nuestros clientes
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Más de 500 restaurantes confían en nosotros
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`bg-white dark:bg-gray-900 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-500 border border-gray-200 dark:border-gray-700 transform hover:scale-105 ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
                style={{ transitionDelay: `${(index + 6) * 100}ms` }}
              >
                <div className="flex items-center mb-6">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{testimonial.restaurant}</p>
                  </div>
                </div>
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 dark:text-gray-300 italic">"{testimonial.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-500 to-red-500">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            ¿Listo para transformar tu restaurante?
          </h2>
          <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
            Únete a cientos de restaurantes que ya están aumentando sus ventas y mejorando su servicio con RestaurantPOS.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onGetStarted}
              className="bg-white text-orange-500 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-200 shadow-lg flex items-center justify-center space-x-2"
            >
              <Play className="w-5 h-5" />
              <span>Probar Demo Gratis</span>
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-orange-500 transition-all duration-200 flex items-center justify-center space-x-2">
              <span>Contactar Ventas</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <div className="bg-gradient-to-r from-orange-500 to-red-500 p-2 rounded-lg">
                  <ChefHat className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold">RestaurantPOS</span>
              </div>
              <p className="text-gray-400 mb-4">
                El sistema POS más completo para restaurantes modernos.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Producto</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Características</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Precios</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Demo</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integraciones</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Soporte</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Centro de Ayuda</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contacto</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Capacitación</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Estado del Sistema</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Empresa</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Acerca de</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Carreras</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacidad</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 RestaurantPOS. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};