
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

export const getStudyContent = async (taskTitle: string, taskDescription: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `토익 800점을 목표로 하는 학생을 위해 다음 주제에 대한 학습 내용을 생성해주세요:
      주제: ${taskTitle} (${taskDescription})
      
      형식: JSON으로 다음 정보를 포함하세요.
      1. lesson: 핵심 이론 설명 (Markdown 형식, 한국어)
      2. examples: 실전 예문 3개와 해석
      3. quiz: 관련 퀴즈 1문제 (문제, 보기 4개, 정답 인덱스, 해설)`,
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
            quiz: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                options: { type: Type.ARRAY, items: { type: Type.STRING } },
                answer: { type: Type.INTEGER },
                explanation: { type: Type.STRING }
              }
            }
          },
          required: ["lesson", "examples", "quiz"]
        }
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Content Generation Error:", error);
    return null;
  }
};
