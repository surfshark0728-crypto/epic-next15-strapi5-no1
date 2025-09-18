import { openai } from "@ai-sdk/openai";  
import { generateText } from "ai";  

// 유튜브 영상의 대본(Transcript)을 요약하는 함수
export async function generateSummary(content: string, template?: string) {
  // systemPrompt: 요약을 생성할 때 사용할 기본 시스템 메시지(템플릿)
  // - 외부에서 template을 넘겨주면 그걸 사용
  // - 없으면 기본 프롬프트(도움말 어시스턴트 역할)를 사용
  const systemPrompt =
    template ||
    `
    You are a helpful assistant that creates concise and informative summaries of YouTube video transcripts.
    Please summarize the following transcript, highlighting the key points and main ideas.
    Keep the summary clear, well-structured, and easy to understand.
  `;

  const systemPromptKo =
    template ||
    `당신은 유튜브 영상 대본을 간결하고 알기 쉽게 요약해 주는 유용한 도우미입니다. 
     아래 대본을 요약할 때 핵심 포인트와 주요 아이디어를 중심으로 정리해 주세요. 
     요약은 명확하고 체계적이며 이해하기 쉽게 작성해 주세요.
    `;

  try {
    // OpenAI 모델을 이용해 요약 텍스트 생성
    const { text } = await generateText({
      // 사용할 모델 지정 (환경 변수 OPENAI_MODEL이 있으면 그걸 쓰고, 없으면 gpt-4o-mini 기본값)
      model: openai(process.env.OPENAI_MODEL ?? "gpt-4o-mini"),

      // 시스템 역할 지시 (systemPrompt 전달)
      system: systemPrompt,

      // 실제 요청 프롬프트 (content = 대본 내용)
      prompt: `Please summarize this transcript:\n\n${content}`,

      // 창의성(랜덤성) 정도 (환경변수 없으면 기본값 0.7)
      temperature: process.env.OPENAI_TEMPERATURE
        ? parseFloat(process.env.OPENAI_TEMPERATURE)
        : 0.7,

      // 모델이 생성할 수 있는 최대 토큰 수 (환경변수 없으면 기본값 4000)
      maxOutputTokens: process.env.OPENAI_MAX_TOKENS
        ? parseInt(process.env.OPENAI_MAX_TOKENS)
        : 4000,
    });

    // 생성된 요약 텍스트 반환
    return text;
  } catch (error) {
    // 에러 발생 시 로그 출력
    console.error("Error generating summary:", error);

    // Error 객체일 경우 상세 메시지 포함해서 throw
    if (error instanceof Error) {
      throw new Error(`Failed to generate summary: ${error.message}`);
    }

    // 그 외 에러일 경우 일반 에러 메시지 throw
    throw new Error("Failed to generate summary");
  }
}
