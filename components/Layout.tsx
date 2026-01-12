
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      {/* Sidebar - Desktop */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden lg:flex flex-col shadow-sm z-20">
        <div className="p-8">
          <h1 className="text-2xl font-black text-indigo-600 flex items-center gap-2 tracking-tighter">
            <span className="w-9 h-9 bg-indigo-600 text-white rounded-xl flex items-center justify-center italic">T</span>
            TOEIC 800
          </h1>
          <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-[0.2em]">3-Week Sprint Plan</p>
        </div>
        <nav className="flex-1 px-4 space-y-1 mt-4">
          {[
            { id: 'dashboard', label: '오늘의 학습', icon: '🏠' },
            { id: 'curriculum', label: '커리큘럼', icon: '📅' },
            { id: 'tutor', label: 'AI 1:1 튜터', icon: '🤖' },
            { id: 'stats', label: '성적 리포트', icon: '📈' },
          ].map((item) => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl text-sm font-bold transition-all ${
                activeTab === item.id 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 translate-x-1' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-indigo-600'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-6">
          <div className="bg-slate-900 rounded-2xl p-5 text-white overflow-hidden relative group">
            <div className="absolute -right-4 -top-4 w-16 h-16 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
            <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Target Score</p>
            <p className="text-2xl font-black mt-1">800+</p>
            <div className="w-full bg-white/10 h-1.5 rounded-full mt-4 overflow-hidden">
              <div className="bg-indigo-500 h-full rounded-full w-2/3 shadow-[0_0_8px_rgba(99,102,241,0.5)]"></div>
            </div>
            <p className="text-[10px] mt-2 opacity-60 font-medium">14 days remaining until test</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-6 lg:px-10 sticky top-0 z-10">
          <div className="flex items-center gap-3">
             <div className="lg:hidden w-8 h-8 bg-indigo-600 text-white rounded-lg flex items-center justify-center font-bold">T</div>
             <h2 className="text-lg font-bold text-slate-800">
                {activeTab === 'dashboard' && 'Daily Sprint'}
                {activeTab === 'curriculum' && 'Roadmap'}
                {activeTab === 'tutor' && 'AI Support'}
                {activeTab === 'stats' && 'Performance'}
              </h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-right">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Current Status</p>
              <p className="text-sm font-black text-indigo-600">Grade 2 Warrior</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 p-[2px] shadow-sm">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-indigo-600 font-black text-sm">
                SC
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto bg-slate-50/50">
          <div className="p-6 lg:p-10 max-w-6xl mx-auto">
            {children}
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <nav className="lg:hidden h-20 bg-white border-t border-slate-200 flex items-center justify-around px-2 pb-2">
          {[
            { id: 'dashboard', label: '홈', icon: '🏠' },
            { id: 'curriculum', label: '계획', icon: '📅' },
            { id: 'tutor', label: '튜터', icon: '🤖' },
            { id: 'stats', label: '분석', icon: '📈' },
          ].map((item) => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-1 flex-1 py-2 transition-colors ${
                activeTab === item.id ? 'text-indigo-600' : 'text-slate-400'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-[10px] font-bold uppercase">{item.label}</span>
              {activeTab === item.id && <div className="w-1 h-1 bg-indigo-600 rounded-full"></div>}
            </button>
          ))}
        </nav>
      </main>
    </div>
  );
};

export default Layout;
