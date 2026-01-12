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
    if (isLoading) return;
    setSelectedTask(task);
    setIsLoading(true);
    setQuizAnswer(null);
    try {
      const data = await getStudyContent(task.title, task.description);
      setStudyData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
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
    <div className="max-w-4xl mx-auto pb-20 px-1">
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-baseline gap-2">
          <h1 className="text-3xl font-bold text-slate-900">Day {plan.day}</h1>
          <span className="text-indigo-600 font-bold text-lg">{plan.theme}</span>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium">
            🎯 오늘의 목표: <span className="text-indigo-600">완강률 100%</span>
          </div>
          <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium text-slate-500">
            ⏰ 예상: {plan.tasks.reduce((acc, t) => acc + t.duration, 0)}분
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {plan.tasks.map((task) => (
          <button 
            key={task.id} 
            className={`w-full p-6 rounded-2xl border transition-all flex items-center gap-4 sm:gap-6 text-left ${
              task.isCompleted ? 'bg-slate-50 border-slate-200' : 'bg-white border-slate-200 hover:border-indigo-300 shadow-sm active:scale-[0.98]'
            }`}
            onClick={() => handleOpenStudy(task)}
          >
            <div className={`text-2xl sm:text-3xl p-3 rounded-xl transition-colors shrink-0 ${task.isCompleted ? 'bg-slate-100' : 'bg-indigo-50'}`}>
              {getIcon(task.type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                  task.type === TaskType.VOCAB ? 'bg-blue-100 text-blue-600' :
                  task.type === TaskType.GRAMMAR ? 'bg-purple-100 text-purple-600' :
                  task.type === TaskType.LC ? 'bg-orange-100 text-orange-600' :
                  'bg-green-100 text-green-600'
                }`}>
                  {task.type}
                </span>
                <span className="text-[10px] text-slate-400 font-bold">{task.duration}분</span>
              </div>
              <h3 className={`text-base sm:text-lg font-bold mt-1 truncate ${task.isCompleted ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                {task.title}
              </h3>
              <p className="text-xs text-slate-500 mt-1 line-clamp-1">{task.description}</p>
            </div>
            <div className={`shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${task.isCompleted ? 'bg-green-500 border-green-500 text-white' : 'border-slate-200 text-slate-300'}`}>
              {task.isCompleted ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <span className="text-[10px] font-black uppercase">Go</span>
              )}
            </div>
          </button>
        ))}
      </div>

      {selectedTask && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-sm p-0 sm:p-4">
          <div className="bg-white w-full max-w-3xl h-[90vh] sm:h-auto sm:max-h-[90vh] rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-indigo-600 text-white shrink-0">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{getIcon(selectedTask.type)}</span>
                <div>
                  <h2 className="font-bold text-base leading-tight">{selectedTask.title}</h2>
                  <p className="text-[10px] opacity-80 uppercase font-bold tracking-widest">{selectedTask.type} Focus Session</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedTask(null)}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/20 active:bg-white/30 transition-colors text-xl"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 sm:p-8 no-scrollbar">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                  <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                  <p className="text-slate-500 font-bold text-sm">AI 튜터가 학습 자료를 만들고 있어요...</p>
                </div>
              ) : studyData ? (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
                  <section>
                    <h3 className="text-indigo-600 font-black text-sm mb-3 flex items-center gap-2 uppercase tracking-widest">
                      <span className="w-1.5 h-4 bg-indigo-600 rounded-full"></span>
                      Core Strategy
                    </h3>
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 text-slate-700 leading-relaxed whitespace-pre-wrap text-sm sm:text-base">
                      {studyData.lesson}
                    </div>
                  </section>

                  <section>
                    <h3 className="text-slate-800 font-black text-sm mb-3 uppercase tracking-widest">Context Examples</h3>
                    <div className="space-y-3">
                      {studyData.examples.map((ex: any, i: number) => (
                        <div key={i} className="p-4 rounded-xl border border-slate-100 bg-white shadow-sm">
                          <p className="font-bold text-indigo-900 text-base sm:text-lg">"{ex.sentence}"</p>
                          <p className="text-xs text-slate-500 mt-1 font-medium">{ex.translation}</p>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section className="bg-indigo-50 p-6 sm:p-8 rounded-3xl border border-indigo-100">
                    <h3 className="text-indigo-900 font-black text-sm mb-4 uppercase tracking-widest">
                      Daily Mini Quiz
                    </h3>
                    <p className="text-slate-800 font-bold mb-6 text-sm sm:text-base leading-relaxed">{studyData.quiz.question}</p>
                    <div className="grid grid-cols-1 gap-2">
                      {studyData.quiz.options.map((opt: string, i: number) => (
                        <button
                          key={i}
                          onClick={() => setQuizAnswer(i)}
                          className={`p-4 rounded-xl text-left text-xs sm:text-sm font-bold transition-all ${
                            quizAnswer === i 
                              ? (i === studyData.quiz.answer ? 'bg-green-500 text-white shadow-lg' : 'bg-rose-500 text-white shadow-lg')
                              : 'bg-white border border-indigo-100 text-slate-700 active:bg-indigo-50'
                          }`}
                        >
                          <span className="mr-2 opacity-40">{String.fromCharCode(65 + i)})</span> {opt}
                        </button>
                      ))}
                    </div>
                    {quizAnswer !== null && (
                      <div className="mt-6 animate-in zoom-in duration-300">
                        <div className={`p-5 rounded-2xl ${quizAnswer === studyData.quiz.answer ? 'bg-green-100 text-green-800' : 'bg-rose-100 text-rose-800'}`}>
                          <p className="font-black text-sm">{quizAnswer === studyData.quiz.answer ? '정답입니다! 🎉' : '다시 확인해볼까요?'}</p>
                          <p className="text-[11px] sm:text-xs mt-2 leading-relaxed font-medium">{studyData.quiz.explanation}</p>
                        </div>
                        <button 
                          onClick={() => {
                            onTaskToggle(selectedTask.id);
                            setSelectedTask(null);
                          }}
                          className="w-full mt-4 py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm hover:bg-indigo-700 active:scale-[0.98] transition-all shadow-lg shadow-indigo-200 uppercase tracking-widest"
                        >
                          Finish Learning
                        </button>
                      </div>
                    )}
                  </section>
                </div>
              ) : (
                <div className="text-center py-20">
                   <p className="text-slate-500 font-bold">자료를 불러오는데 실패했습니다.</p>
                   <button onClick={() => setSelectedTask(null)} className="mt-4 text-indigo-600 font-bold underline">닫기</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
