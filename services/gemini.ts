
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getAITutorResponse = async (userMessage: string, context: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Context: You are a professional TOEIC tutor for a Korean student (CSAT English Grade 2). 
      Session context: ${context}.
      User Question: ${userMessage}
      Provide a concise, practical explanation in Korean. Focus on 800+ score strategies.`,
      config: {
        temperature: 0.7,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "AI 튜터와 연결할 수 없습니다. 잠시 후 다시 시도해주세요.";
  }
};

export const getStudyContent = async (taskTitle: string, taskDescription: string, duration: number) => {
  try {
    // 시간에 따른 콘텐츠 양 조절 (30분이면 약 5문제, 60분이면 약 10문제 목표)
    const quizCount = Math.max(3, Math.min(10, Math.floor(duration / 10 + 2)));
    const exampleCount = Math.max(5, Math.min(15, Math.floor(duration / 5)));

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `토익 800점을 목표로 하는 학생을 위해 다음 주제에 대해 ${duration}분 분량의 심도 있는 학습 내용을 생성해주세요:
      주제: ${taskTitle} (${taskDescription})
      
      지침:
      1. lesson: 800점 돌파를 위한 핵심 비법과 수능 영어와의 차이점을 명확히 짚어주는 심화 이론 (Markdown 형식)
      2. examples: 실전 비즈니스 맥락이 담긴 예문 ${exampleCount}개와 해석
      3. quizzes: 주제와 관련된 실전 형식 퀴즈 ${quizCount}문제 (객관식 4지선다)

      형식: 반드시 JSON으로 응답하세요.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            lesson: { type: Type.STRING },
            examples: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  sentence: { type: Type.STRING },
                  translation: { type: Type.STRING }
                }
              }
            },
            quizzes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  options: { type: Type.ARRAY, items: { type: Type.STRING } },
                  answer: { type: Type.INTEGER },
                  explanation: { type: Type.STRING }
                }
              }
            }
          },
          required: ["lesson", "examples", "quizzes"]
        }
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Content Generation Error:", error);
    return null;
  }
};
