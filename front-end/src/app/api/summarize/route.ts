import { NextRequest } from "next/server";
import { actions } from "@/data/actions";
import { services } from "@/data/services";
import { safeRequireAuthUser } from "@/lib/auth-helpers";

export const maxDuration = 150;
export const dynamic = "force-dynamic";


const TEMPLATE = `
You are an expert content analyst and copywriter. Create a comprehensive summary following this exact structure:

## Quick Overview
Start with a 2-3 sentence description of what this content covers.

## Key Topics Summary
Summarize the content using 5 main topics. Write in a conversational, first-person tone as if explaining to a friend.

## Key Points & Benefits
List the most important points and practical benefits viewers will gain.

## Detailed Summary
Write a complete Summary including:
- Engaging introduction paragraph
- Timestamped sections (if applicable)
- Key takeaways section
- Call-to-action

---
Format your response using clear markdown headers and bullet points. Keep language natural and accessible throughout.
`.trim();


const TEMPLATE_KO = `
당신은 전문 콘텐츠 분석가이자 카피라이터입니다. 아래 구조를 정확히 따라 종합 요약을 작성하세요:

## 빠른 개요
이 콘텐츠가 다루는 내용을 2~3문장으로 간단히 설명합니다.

## 핵심 주제 요약
콘텐츠를 5가지 주요 주제로 요약합니다. 친구에게 설명하듯 대화체로 작성하세요.

## 핵심 포인트 & 이점
시청자가 얻을 수 있는 가장 중요한 포인트와 실질적인 이점을 나열하세요.

## 상세 요약
아래 요소를 포함한 완전한 요약을 작성하세요:
- 흥미로운 도입 문단
- 타임스탬프별 섹션 (가능한 경우)
- 핵심 정리 섹션
- 행동 유도(Call-to-action)

---
응답은 명확한 마크다운 헤더와 불릿 포인트를 사용하여 작성하세요. 전체적으로 자연스럽고 쉽게 읽히는 언어를 유지하세요.
`.trim();




export async function POST(req: NextRequest) {
    const auth =await safeRequireAuthUser();

    if(!auth.success){
        return new Response(JSON.stringify(auth),{
            status: auth.status ?? 401,
            headers: { "Content-Type": "application/json" },
        });
    }

    const user=auth.data;
    
   if (!user || (user.credits || 0) < 1) {
    return new Response(
      JSON.stringify({
        error: {
          status: 402,
          name: "InsufficientCredits", 
          message: "요약을 생성하기 위한 크레딧이 부족합니다.",
        }
      }),
      { status: 402 }
    );
  }
   console.log("✅USER CREDITS: ", user?.credits);



    const body =await req.json();
    const {fullTranscript} = body;

    if(!fullTranscript){
        return new Response(JSON.stringify({error: "No transcript provided",}),{
             status: 400 
        });
    }

 
    try{
        const summary=await services.summarize.generateSummary(fullTranscript, TEMPLATE);

        return new Response(JSON.stringify({ data: summary, error: null }));
    }catch(error){
        console.error("Error processing request:", error);
        if (error instanceof Error)
        return new Response(JSON.stringify({ error: error.message }));
        return new Response(JSON.stringify({ error: "Error generating summary." }));
    }

}
