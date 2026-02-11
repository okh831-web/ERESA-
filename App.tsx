
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Home from './pages/Home';
import EvaluationStagePage from './pages/EvaluationStage';
import History from './pages/History';
import { EvaluationReport } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [history, setHistory] = useState<EvaluationReport[]>([]);

  // Load history from session storage if available
  useEffect(() => {
    const saved = sessionStorage.getItem('eresa_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load history", e);
      }
    }
  }, []);

  const saveReport = (report: EvaluationReport) => {
    const newHistory = [...history, report];
    setHistory(newHistory);
    sessionStorage.setItem('eresa_history', JSON.stringify(newHistory));
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <Home onStart={setActiveTab} />;
      case 'stage1':
        return (
          <EvaluationStagePage 
            stage="1차" 
            onSave={saveReport} 
          />
        );
      case 'stage2':
        return (
          <EvaluationStagePage 
            stage="2차" 
            previousReports={history}
            onSave={saveReport} 
          />
        );
      case 'stage3':
        return (
          <EvaluationStagePage 
            stage="3차" 
            previousReports={history}
            onSave={saveReport} 
          />
        );
      case 'history':
        return <History reports={history} />;
      default:
        return <Home onStart={setActiveTab} />;
    }
  };

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      <div className="transition-all duration-300">
        {renderContent()}
      </div>
    </Layout>
  );
};

export default App;
