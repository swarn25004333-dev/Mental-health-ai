import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Ambient background orbs — decorative, CSS-only */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="ambient-orb w-[600px] h-[600px] bg-blue-600/[0.06] top-[-200px] left-[-100px] animate-float" />
        <div className="ambient-orb w-[500px] h-[500px] bg-violet-600/[0.05] bottom-[-150px] right-[-100px] animate-float-delay" />
        <div className="ambient-orb w-[300px] h-[300px] bg-indigo-500/[0.04] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* Top Navbar */}
      <Navbar onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />

      <div className="flex-1 flex overflow-hidden relative z-10">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
