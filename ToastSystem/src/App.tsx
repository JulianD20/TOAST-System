import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { POSProvider } from './contexts/POSContext';
import { LoginForm } from './components/auth/LoginForm';
import { LandingPage } from './components/landing/LandingPage';
import { Sidebar } from './components/common/Sidebar';
import { Header } from './components/common/Header';
import { Dashboard } from './components/dashboard/Dashboard';
import { TablesView } from './components/tables/TablesView';
import { POSView } from './components/pos/POSView';
import { KitchenView } from './components/kitchen/KitchenView';
import { ProductsView } from './components/products/ProductsView';
import { CashierView } from './components/cashier/CashierView';
import { UsersView } from './components/users/UsersView';
import { TableManagementView } from './components/tables/TableManagementView';
import { ReportsView } from './components/reports/ReportsView';
import { SettingsView } from './components/settings/SettingsView';
import { ReservationsView } from './components/reservations/ReservationsView';

function AppContent() {
  const { isAuthenticated, user } = useAuth();
  const [currentView, setCurrentView] = useState('dashboard');
  const [showLanding, setShowLanding] = useState(true);

  // Listen for navigation events
  React.useEffect(() => {
    const handleNavigateToPOS = () => {
      setCurrentView('pos');
    };

    window.addEventListener('navigateToPOS', handleNavigateToPOS);
    return () => window.removeEventListener('navigateToPOS', handleNavigateToPOS);
  }, []);

  if (showLanding && !isAuthenticated) {
    return <LandingPage onGetStarted={() => setShowLanding(false)} />;
  }

  if (!isAuthenticated) {
    return <LoginForm onBackToLanding={() => setShowLanding(true)} />;
  }

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'tables':
        return <TablesView />;
      case 'pos':
        return <POSView />;
      case 'table-management':
        return <TableManagementView />;
      case 'kitchen':
        return <KitchenView />;
      case 'products':
        return <ProductsView />;
      case 'users':
        return <UsersView />;
      case 'reports':
        return <ReportsView />;
      case 'cashier':
        return <CashierView />;
      case 'reservations':
        return <ReservationsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-auto p-6">
          {renderView()}
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <POSProvider>
        <AppContent />
      </POSProvider>
    </AuthProvider>
  );
}

export default App;
