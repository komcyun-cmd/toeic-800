
import { TaskType, DailyPlan, UserStats } from './types';

const generateCurriculum = (): DailyPlan[] => {
  const curriculum: DailyPlan[] = [];

  for (let i = 1; i <= 21; i++) {
    let theme = "";
    let tasks = [];

    if (i <= 7) {
      // 1주차: 수능 문법을 토익으로 치환 (Part 1, 2, 5 기초)
      const themes = [
        "토익 기초: 품사론 & Part 1",
        "동사 파트 정복 & Part 2 (1)",
        "준동사 완벽 정리 & Part 2 (2)",
        "접속사/전치사 구별 & Part 5 속도",
        "명사/형용사 보어 & Part 1 빈출 표현",
        "Part 2 간접 응답 집중 훈련",
        "1주차 총정리 및 하프 모의고사"
      ];
      theme = themes[i - 1];
      tasks = [
        { id: `d${i}-1`, type: TaskType.VOCAB, title: `필수 비즈니스 어휘 ${i}`, description: "사무 환경 및 일상 업무 관련 빈출 단어", isCompleted: false, duration: 30 },
        { id: `d${i}-2`, type: i % 2 === 0 ? TaskType.GRAMMAR : TaskType.RC, title: `핵심 문법/독해 Day ${i}`, description: "수능 지식을 토익 포인트로 전환", isCompleted: false, duration: 60 },
        { id: `d${i}-3`, type: TaskType.LC, title: `LC 집중 공략 Day ${i}`, description: "Part 1, 2 오답 소거법 연습", isCompleted: false, duration: 40 }
      ];
    } else if (i <= 14) {
      // 2주차: 문제 풀이 속도 및 비즈니스 문맥 적응 (Part 3, 4, 6)
      const themes = [
        "Part 3 대화 흐름 파악 & 패러프레이징",
        "Part 4 담화문 핵심 정보 찾기",
        "Part 6 문맥에 맞는 문장 삽입",
        "Part 3/4 시각 자료 연계 문제",
        "비즈니스 이메일/공고문 독해 전략",
        "LC 전체 파트 시간 관리 및 소거법",
        "2주차 중간 점검: LC/RC 하프 테스트"
      ];
      theme = themes[i - 8];
      tasks = [
        { id: `d${i}-1`, type: TaskType.VOCAB, title: `심화 비즈니스 어휘 ${i}`, description: "동의어 및 다의어 위주 암기", isCompleted: false, duration: 30 },
        { id: `d${i}-2`, type: TaskType.LC, title: "LC 중장문 집중 청취", description: "화자의 의도와 숨은 의미 파악", isCompleted: false, duration: 50 },
        { id: `d${i}-3`, type: TaskType.RC, title: "RC 지문 독해 속도 향상", description: "지문당 1분 컷 전략", isCompleted: false, duration: 60 }
      ];
    } else {
      // 3주차: 실전 감각 및 고난도 연계 지문 (Part 7, Full Mock)
      const themes = [
        "Part 7 이중 지문 연계 정보 찾기",
        "Part 7 삼중 지문 시간 단축 비법",
        "고난도 문법 총정리 (Part 5)",
        "실전 모의고사 1세트 & 오답 분석",
        "실전 모의고사 2세트 & 약점 보완",
        "최종 핵심 요약 및 빈출 함정 정리",
        "Final Check: 800점 돌파 최종 점검"
      ];
      theme = themes[i - 15];
      tasks = [
        { id: `d${i}-1`, type: TaskType.MOCK_TEST, title: i % 2 === 0 ? "실전 모의고사" : "하프 테스트", description: "마킹 연습 및 실전 시간 배분", isCompleted: false, duration: 120 },
        { id: `d${i}-2`, type: TaskType.VOCAB, title: "적중 예상 어휘 80", description: "최신 출제 경향 반영 어휘", isCompleted: false, duration: 20 },
        { id: `d${i}-3`, type: TaskType.RC, title: "최종 오답 노트 정리", description: "틀린 유형 반복 학습", isCompleted: false, duration: 40 }
      ];
    }

    curriculum.push({ day: i, theme, tasks, completedCount: 0 });
  }

  return curriculum;
};

export const CURRICULUM: DailyPlan[] = generateCurriculum();

export const USER_INITIAL_STATS: UserStats = {
  currentDay: 1,
  totalCompletedTasks: 0,
  weeklyProgress: [
    { day: 'W1', score: 650 },
    { day: 'W2', score: 720 },
    { day: 'W3', score: 780 },
  ],
  weakPoints: ['Part 5 전치사/접속사', 'Part 7 다중 지문 연계', 'LC Part 2 우회적 응답']
};
