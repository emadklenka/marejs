import { useState } from "react";
import { toast, Toaster } from 'sonner';
import { PopupContainer } from '../components/KPopup.jsx';

// Import UI Guide components
import AlertsSection from '../components/ui-guide/AlertsSection.jsx';
import ToastSection from '../components/ui-guide/ToastSection.jsx';
import ButtonsSection from '../components/ui-guide/ButtonsSection.jsx';
import CardsSection from '../components/ui-guide/CardsSection.jsx';
import BadgesSection from '../components/ui-guide/BadgesSection.jsx';
import ProgressSection from '../components/ui-guide/ProgressSection.jsx';
import FormsSection from '../components/ui-guide/FormsSection.jsx';
import DataDisplaySection from '../components/ui-guide/DataDisplaySection.jsx';
import IconsSection from '../components/ui-guide/IconsSection.jsx';
import PopupsSection from '../components/ui-guide/PopupsSection.jsx';

export default function UiGuide() {
  const [activeTab, setActiveTab] = useState('components');

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <Toaster position="top-right" expand={false} richColors />
      <PopupContainer />
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-base-content">UI Components Guide</h1>
        <p className="text-lg text-base-content/70">
          Complete showcase of all UI components for KPI Research Performance Management System
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="tabs tabs-boxed bg-base-200 p-1">
        <button 
          className={`tab ${activeTab === 'components' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('components')}
        >
          Components
        </button>
        <button 
          className={`tab ${activeTab === 'forms' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('forms')}
        >
          Forms
        </button>
        <button 
          className={`tab ${activeTab === 'data' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('data')}
        >
          Data Display
        </button>
        <button
          className={`tab ${activeTab === 'icons' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('icons')}
        >
          Icons
        </button>
        <button
          className={`tab ${activeTab === 'popups' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('popups')}
        >
          Popups
        </button>
      </div>

      {/* Components Tab */}
      {activeTab === 'components' && (
        <div className="space-y-8">
          <AlertsSection />
          <ToastSection />
          <ButtonsSection />
          <CardsSection />
          <BadgesSection />
          <ProgressSection />
        </div>
      )}

      {/* Forms Tab */}
      {activeTab === 'forms' && (
        <div className="space-y-8">
          <FormsSection />
        </div>
      )}

      {/* Data Display Tab */}
      {activeTab === 'data' && (
        <div className="space-y-8">
          <DataDisplaySection />
        </div>
      )}

      {/* Icons Tab */}
      {activeTab === 'icons' && (
        <div className="space-y-8">
          <IconsSection />
        </div>
      )}

      {/* Popups Tab */}
      {activeTab === 'popups' && (
        <div className="space-y-8">
          <PopupsSection />
        </div>
      )}
    </div>
  );
}