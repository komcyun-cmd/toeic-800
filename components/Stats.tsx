
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { UserStats } from '../types';

interface StatsProps {
  stats: UserStats;
}

const Stats: React.FC<StatsProps> = ({ stats }) => {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-slate-500 text-sm">현재 예상 점수</p>
          <p className="text-4xl font-bold text-indigo-600 mt-1">745<span className="text-sm text-slate-400 ml-1">점</span></p>
          <p className="text-xs text-green-500 mt-2 font-medium">▲ 전주 대비 15점 상승</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-slate-500 text-sm">완료한 학습 태스크</p>
          <p className="text-4xl font-bold text-slate-800 mt-1">{stats.totalCompletedTasks}<span className="text-sm text-slate-400 ml-1">개</span></p>
          <p className="text-xs text-slate-400 mt-2 font-medium">목표까지 {21 * 3 - stats.totalCompletedTasks}개 남음</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-slate-500 text-sm">연속 학습일</p>
          <p className="text-4xl font-bold text-orange-500 mt-1">5<span className="text-sm text-slate-400 ml-1">일</span></p>
          <p className="text-xs text-orange-300 mt-2 font-medium">🔥 불타오르는 중!</p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-bold mb-6 text-slate-800">성적 추이 Analysis</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={stats.weeklyProgress}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dx={-10} domain={[500, 900]} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                labelStyle={{ fontWeight: 'bold', marginBottom: '4px' }}
              />
              <Line 
                type="monotone" 
                dataKey="score" 
                stroke="#6366f1" 
                strokeWidth={4} 
                dot={{ r: 6, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-bold mb-4 text-slate-800">AI가 분석한 나의 취약점</h3>
        <div className="flex flex-wrap gap-3">
          {stats.weakPoints.map((point, idx) => (
            <div key={idx} className="px-4 py-2 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-sm font-medium">
              ⚠️ {point}
            </div>
          ))}
        </div>
        <div className="mt-6 p-4 bg-slate-50 rounded-xl">
          <p className="text-sm text-slate-600 leading-relaxed italic">
            "수능 2등급 특성상 관계대명사나 분사구문 등 복잡한 문법은 잘 이해하고 계십니다. 하지만 토익 특유의 <b>비즈니스 이메일 문체</b>와 <b>함정 응답(Part 2)</b>에서 감점이 발생하고 있어요. 남은 2주간은 실전 모의고사 위주로 양치기를 늘리면 금방 800점을 돌파할 수 있습니다."
          </p>
        </div>
      </div>
    </div>
  );
};

export default Stats;
