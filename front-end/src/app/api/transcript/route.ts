import { NextRequest } from "next/server";
import {  safeRequireAuthUser } from "@/lib/auth-helpers";
import { services } from "@/data/services";

/**
 *
 * 예를 들어 Vercel 같은 서버리스 환경에서는 Lambda 실행 제한 시간이 있는데,
 *  maxDuration을 지정하면 Next.js가 내부적으로 이 route는 최대 150초까지 실행 허용하겠다고 알려주는 겁니다.
 */
export const maxDuration = 150; // ISR/Streaming 등 제한 시간

/**
export const dynamic = "force-dynamic";
기본적으로 Next.js의 App Router는 가능하면 캐싱(static) 처리하려고 합니다.
하지만 인증 API처럼 매번 달라져야 하는 응답에는 캐싱이 있으면 안 되죠.
그래서 "force-dynamic"을 쓰면 Next.js에게 항상 서버에서 새로 실행하도록 강제하는 거예요.
(즉, SSG/ISR 캐싱을 완전히 끄는 옵션)
👉 보통 인증, 유저 데이터, DB 트랜잭션 같은 건 "force-dynamic"을 꼭 걸어주는 게 맞습니다. 
* 
 */
export const dynamic = "force-dynamic"; // 캐싱 안 하고 동적 처리



export async function POST(req: NextRequest) {
  const auth = await safeRequireAuthUser();

  if (!auth.success) {
    return new Response(JSON.stringify(auth), {
      status: auth.status ?? 401,
      headers: { "Content-Type": "application/json" },
    });
  }


  const body =await req.json();
  const videoId = body.videoId;

  try{
    console.log("✅ 자막 가져오기  시작 : videoId", videoId);

    const transcriptData =await services.summarize.generateTranscript(videoId);

    if(!transcriptData?.fullTranscript){
      console.log("🤬 번역할 데이터를 찾을 수 없습니다. ");
      throw new Error("번역할 데이터를 찾을 수 없습니다.");
    }


    // if(!transcriptData?.fullTranscriptKo){
    //   console.log("🤬 한국어 번역할 데이터를 찾을 수 없습니다. ");
    //   throw new Error("번역할 데이터를 찾을 수 없습니다.");
    // }


    return new Response(JSON.stringify({data:transcriptData, error:null}));

  }catch(error){
    console.error("요청을 처리하는 중에 오류가 발생했습니다.", error);
    if(error instanceof Error)
      return new Response(JSON.stringify({error:error.message}));
    return new Response(JSON.stringify({error:"요청을 처리하는 중에 오류가 발생했습니다."}));
  }

}

