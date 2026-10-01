import React, { useState } from 'react';
import { TopNav } from './components/TopNav';
import { OperationalRibbon } from './components/OperationalRibbon';
import { HomePage } from './pages/HomePage';
import { AchievementsPage } from './pages/AchievementsPage';
import { ZonesPage } from './pages/ZonesPage';
import { SheltersPage } from './pages/SheltersPage';
import { LedgerPage } from './pages/LedgerPage';
import { StoriesPage } from './pages/StoriesPage';
import { FieldWorkerPage } from './pages/FieldWorkerPage';
import { EmergencyAidRequestModal } from './components/EmergencyAidRequestModal';
import { DonationDrawer } from './components/DonationDrawer';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  const [activePage, setActivePage] = useState<string>('home');
  const [donateModalOpen, setDonateModalOpen] = useState(false);
  const [aidRequestModalOpen, setAidRequestModalOpen] = useState(false);
  const [donationAmount, setDonationAmount] = useState<number>(65000);
  const [targetedZone, setTargetedZone] = useState<string | undefined>(undefined);

  const handleNavigate = (page: string) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenDonate = (amount?: number) => {
    if (amount) {
      setDonationAmount(amount);
    }
    setTargetedZone(undefined);
    setDonateModalOpen(true);
  };

  const handleSponsorZone = (zoneName: string) => {
    setTargetedZone(zoneName);
    setDonationAmount(65000);
    setDonateModalOpen(true);
  };

  const handleFundModel = (costPKR: number, modelName: string) => {
    setTargetedZone(`Shelter: ${modelName}`);
    setDonationAmount(costPKR);
    setDonateModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#1C1917] selection:bg-[#0284C7]/20 selection:text-[#0C4A6E]">
      {/* 24/7 Pakistan Field Operational Status Banner */}
      <OperationalRibbon />

      {/* Minimal TopNav (Links housed inside Menu Drawer with Urdu Switcher) */}
      <TopNav
        activePage={activePage}
        onNavigate={handleNavigate}
        onOpenDonate={() => handleOpenDonate()}
        onOpenAidRequest={() => setAidRequestModalOpen(true)}
      />

      {/* Dynamic Page Content */}
      <main className="flex-1">
        {activePage === 'home' && (
          <HomePage
            onNavigate={handleNavigate}
            onOpenDonate={handleOpenDonate}
            onOpenAidRequest={() => setAidRequestModalOpen(true)}
          />
        )}

        {activePage === 'achievements' && (
          <AchievementsPage
            onBackToHome={() => handleNavigate('home')}
          />
        )}

        {activePage === 'field-worker' && (
          <FieldWorkerPage
            onBackToHome={() => handleNavigate('home')}
          />
        )}

        {activePage === 'zones' && (
          <ZonesPage
            onBackToHome={() => handleNavigate('home')}
            onSponsorZone={handleSponsorZone}
          />
        )}

        {activePage === 'shelters' && (
          <SheltersPage
            onBackToHome={() => handleNavigate('home')}
            onFundModel={handleFundModel}
          />
        )}

        {activePage === 'ledger' && (
          <LedgerPage
            onBackToHome={() => handleNavigate('home')}
          />
        )}

        {activePage === 'stories' && (
          <StoriesPage
            onBackToHome={() => handleNavigate('home')}
          />
        )}
      </main>

      {/* Institutional Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenDonate={() => handleOpenDonate()}
        onOpenAidRequest={() => setAidRequestModalOpen(true)}
      />

      {/* Interactive Emergency Aid Intake Portal Modal */}
      <EmergencyAidRequestModal
        isOpen={aidRequestModalOpen}
        onClose={() => setAidRequestModalOpen(false)}
      />

      {/* Interactive Rehousing Sponsorship & FBR Tax Receipt Drawer */}
      <DonationDrawer
        isOpen={donateModalOpen}
        onClose={() => setDonateModalOpen(false)}
        initialAmount={donationAmount}
        targetedZone={targetedZone}
      />
    </div>
  );
};

export default App;
