
import React, { useState } from 'react';
import { DailyPlan, Task, TaskType } from '../types';
import { getStudyContent } from '../services/gemini';

interface DashboardProps {
  plan: DailyPlan;
  onTaskToggle: (taskId: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ plan, onTaskToggle }) => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [studyData, setStudyData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);

  const handleOpenStudy = async (task: Task) => {
    setSelectedTask(task);
    setIsLoading(true);
    setQuizAnswer(null);
    const data = await getStudyContent(task.title, task.description);
    setStudyData(data);
    setIsLoading(false);
  };

  const getIcon = (type: TaskType) => {
    switch (type) {
      case TaskType.VOCAB: return '📚';
      case TaskType.GRAMMAR: return '✏️';
      case TaskType.LC: return '🎧';
      case TaskType.RC: return '📖';
      case TaskType.MOCK_TEST: return '⏱️';
      default: return '📝';
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="mb-8">
        <div className="flex items-baseline gap-3">
          <h1 className="text-3xl font-bold text-slate-900">Day {plan.day}</h1>
          <span className="text-indigo-600 font-medium">{plan.theme}</span>
        </div>
        <div className="mt-4 flex gap-4">
          <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium">
            🎯 오늘의 목표: <span className="text-indigo-600">완강률 100%</span>
          </div>
          <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-500">
            ⏰ 예상 소요 시간: {plan.tasks.reduce((acc, t) => acc + t.duration, 0)}분
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {plan.tasks.map((task) => (
          <div 
            key={task.id} 
            className={`p-6 rounded-2xl border transition-all cursor-pointer flex items-center gap-6 group ${task.isCompleted ? 'bg-slate-50 border-slate-200' : 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-md'}`}
            onClick={() => handleOpenStudy(task)}
          >
            <div className={`text-3xl p-3 rounded-xl transition-colors ${task.isCompleted ? 'bg-slate-100' : 'bg-indigo-50 group-hover:bg-indigo-100'}`}>
              {getIcon(task.type)}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                  task.type === TaskType.VOCAB ? 'bg-blue-100 text-blue-600' :
                  task.type === TaskType.GRAMMAR ? 'bg-purple-100 text-purple-600' :
                  task.type === TaskType.LC ? 'bg-orange-100 text-orange-600' :
                  'bg-green-100 text-green-600'
                }`}>
                  {task.type}
                </span>
                <span className="text-xs text-slate-400">{task.duration}분</span>
              </div>
              <h3 className={`text-lg font-bold mt-1 ${task.isCompleted ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                {task.title}
              </h3>
              <p className="text-sm text-slate-500 mt-1">{task.description}</p>
            </div>
            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${task.isCompleted ? 'bg-green-500 border-green-500 text-white' : 'border-slate-200 group-hover:border-indigo-500'}`}>
              {task.isCompleted ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <span className="text-xs font-bold text-slate-300 group-hover:text-indigo-500">Go</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Study Modal Overlay */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-3xl max-h-[90vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-indigo-600 text-white">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{getIcon(selectedTask.type)}</span>
                <div>
                  <h2 className="font-bold text-lg leading-tight">{selectedTask.title}</h2>
                  <p className="text-xs opacity-80">{selectedTask.type} 집중 학습</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedTask(null)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                  <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                  <p className="text-slate-500 font-medium">AI가 개인 맞춤 학습 자료를 생성 중입니다...</p>
                </div>
              ) : studyData ? (
                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <section>
                    <h3 className="text-indigo-600 font-bold mb-3 flex items-center gap-2">
                      <span className="w-1.5 h-6 bg-indigo-600 rounded-full"></span>
                      핵심 포인트
                    </h3>
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-slate-700 leading-relaxed whitespace-pre-wrap">
                      {studyData.lesson}
                    </div>
                  </section>

                  <section>
                    <h3 className="text-slate-800 font-bold mb-3">실전 예문 문맥 익히기</h3>
                    <div className="space-y-3">
                      {studyData.examples.map((ex: any, i: number) => (
                        <div key={i} className="p-4 rounded-xl border border-slate-100 bg-white shadow-sm hover:border-indigo-100 transition-colors">
                          <p className="font-semibold text-indigo-900 text-lg">"{ex.sentence}"</p>
                          <p className="text-sm text-slate-500 mt-1">{ex.translation}</p>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section className="bg-indigo-50/50 p-8 rounded-3xl border border-indigo-100">
                    <h3 className="text-indigo-900 font-bold mb-4 flex items-center gap-2">
                      📝 데일리 미니 퀴즈
                    </h3>
                    <p className="text-slate-700 font-medium mb-6">{studyData.quiz.question}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {studyData.quiz.options.map((opt: string, i: number) => (
                        <button
                          key={i}
                          onClick={() => setQuizAnswer(i)}
                          className={`p-4 rounded-xl text-left text-sm font-medium transition-all ${
                            quizAnswer === i 
                              ? (i === studyData.quiz.answer ? 'bg-green-500 text-white shadow-lg' : 'bg-rose-500 text-white shadow-lg')
                              : 'bg-white border border-indigo-100 text-slate-700 hover:border-indigo-400'
                          }`}
                        >
                          <span className="mr-2 opacity-50">{String.fromCharCode(65 + i)})</span> {opt}
                        </button>
                      ))}
                    </div>
                    {quizAnswer !== null && (
                      <div className="mt-6 animate-in zoom-in duration-300">
                        <div className={`p-4 rounded-xl ${quizAnswer === studyData.quiz.answer ? 'bg-green-100 text-green-800' : 'bg-rose-100 text-rose-800'}`}>
                          <p className="font-bold">{quizAnswer === studyData.quiz.answer ? '정답입니다! 🎉' : '아쉽네요, 다시 한 번 확인해보세요.'}</p>
                          <p className="text-xs mt-1 leading-relaxed">{studyData.quiz.explanation}</p>
                        </div>
                        <button 
                          onClick={() => {
                            onTaskToggle(selectedTask.id);
                            setSelectedTask(null);
                          }}
                          className="w-full mt-4 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
                        >
                          학습 완료하고 종료하기
                        </button>
                      </div>
                    )}
                  </section>
                </div>
              ) : (
                <p className="text-center text-slate-500 py-10">데이터를 불러오지 못했습니다.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
