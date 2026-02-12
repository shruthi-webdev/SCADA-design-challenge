import { useState, useEffect } from 'react';
import TopBar from './components/TopBar';
import Sidebar from './components/Sidebar';
import type { NavPage } from './components/Sidebar';
import WaterSystemView from './views/WaterSystemView';
import AlertsView from './views/AlertsView';
import TransferView from './views/TransferView';
import './App.css';

// Map nav pages to subtitle text shown in the TopBar
const subtitleMap: Record<NavPage, string> = {
  dashboard: 'Dashboard',
  analytics: 'Analytics',
  devices: 'Devices',
  ga: 'GA',
  water: 'Water System',
  transfer: 'Transfer',
  ac1: 'AC',
  ac2: 'AC',
  technical: 'Technical Rooms',
  engine: 'Engine Room',
  provision: 'Provision Plant',
  cardeck: 'Cardeck',
  battery_aft: 'Battery AFT',
  battery_fwd: 'Battery FWD',
  alerts: 'Alert',
  help: 'Help',
  settings: 'Settings',
};

function App() {
  const [activePage, setActivePage] = useState<NavPage>('water');
  const [isDark, setIsDark] = useState(false);

  // Apply theme to the root HTML element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const renderContent = () => {
    switch (activePage) {
      case 'alerts':
        return <AlertsView />;
      case 'transfer':
        return <TransferView />;
      default:
        // All other pages show the water system view for now
        return <WaterSystemView />;
    }
  };

  return (
    <div className="app">
      <TopBar
        title="Teknotherm SCADA"
        subtitle={subtitleMap[activePage]}
        isDark={isDark}
        onToggleTheme={() => setIsDark(prev => !prev)}
      />
      <div className="app-body">
        <Sidebar activePage={activePage} onNavigate={setActivePage} />
        <main className="app-content">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default App;
