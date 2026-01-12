
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import AITutor from './components/AITutor';
import Stats from './components/Stats';
import { CURRICULUM, USER_INITIAL_STATS } from './constants';
import { UserStats, DailyPlan } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [curriculum, setCurriculum] = useState<DailyPlan[]>(CURRICULUM);
  const [userStats, setUserStats] = useState<UserStats>(USER_INITIAL_STATS);
  const [viewingDay, setViewingDay] = useState(1);

  const handleTaskToggle = (taskId: string) => {
    setCurriculum(prev => prev.map(dayPlan => ({
      ...dayPlan,
      tasks: dayPlan.tasks.map(task => 
        task.id === taskId ? { ...task, isCompleted: !task.isCompleted } : task
      )
    })));
  };

  useEffect(() => {
    const totalCompleted = curriculum.reduce((acc, day) => 
      acc + day.tasks.filter(t => t.isCompleted).length, 0
    );
    setUserStats(prev => ({ ...prev, totalCompletedTasks: totalCompleted }));
  }, [curriculum]);

  const currentDayPlan = curriculum.find(d => d.day === viewingDay) || curriculum[0];

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === 'dashboard' && (
        <>
          <div className="mb-6 flex overflow-x-auto pb-2 gap-2 no-scrollbar">
            {curriculum.map(day => (
              <button
                key={day.day}
                onClick={() => setViewingDay(day.day)}
                className={`flex-shrink-0 w-12 h-12 rounded-xl font-bold transition-all ${
                  viewingDay === day.day 
                  ? 'bg-indigo-600 text-white shadow-lg' 
                  : day.tasks.every(t => t.isCompleted) 
                    ? 'bg-green-100 text-green-600 border border-green-200' 
                    : 'bg-white text-slate-400 border border-slate-200 hover:border-indigo-300'
                }`}
              >
                {day.day}
              </button>
            ))}
          </div>
          <Dashboard 
            plan={currentDayPlan} 
            onTaskToggle={handleTaskToggle} 
          />
        </>
      )}
      {activeTab === 'curriculum' && (
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="bg-indigo-600 text-white p-8 rounded-3xl mb-6">
            <h1 className="text-3xl font-black italic">ROADMAP TO 800</h1>
            <p className="mt-2 opacity-90 font-medium">수능 2등급 맞춤: 1주차 문법 복원, 2주차 속도 향상, 3주차 실전 감각</p>
          </div>
          
          {['1주차: 기초 체력', '2주차: 심화 적응', '3주차: 실전 스퍼트'].map((weekTitle, weekIdx) => (
            <div key={weekIdx} className="space-y-3">
              <h2 className="text-lg font-bold text-slate-800 ml-2 mt-8 mb-4">{weekTitle}</h2>
              {curriculum.slice(weekIdx * 7, (weekIdx + 1) * 7).map(day => (
                <div 
                  key={day.day} 
                  onClick={() => { setViewingDay(day.day); setActiveTab('dashboard'); }}
                  className={`p-5 rounded-2xl border bg-white cursor-pointer transition-all hover:shadow-md flex items-center justify-between ${day.day === viewingDay ? 'border-indigo-500 ring-1 ring-indigo-500' : 'border-slate-200'}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black ${day.tasks.every(t => t.isCompleted) ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-600'}`}>
                      {day.day}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800">{day.theme}</h3>
                      <p className="text-xs text-slate-400">태스크 {day.tasks.length}개 • {day.tasks.reduce((a,b)=>a+b.duration,0)}분</p>
                    </div>
                  </div>
                  {day.tasks.every(t => t.isCompleted) && (
                    <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-[10px] font-bold">완료</span>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
      {activeTab === 'tutor' && <AITutor />}
      {activeTab === 'stats' && <Stats stats={userStats} />}
    </Layout>
  );
};

export default App;
