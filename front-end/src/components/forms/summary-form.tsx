"use client";
import { useState } from "react";
import { Input } from "../ui/input";
import { cn, extractYouTubeID } from "@/lib/utils";
import { SubmitButton } from "../custom/submit-button";
import { toast } from "sonner";
import { api } from "@/data/data-api";

type ITranscriptResponse = {
  fullTranscript: string;
  title?: string;
  videoId?: string;
  thumbnailUrl?: string;
};

interface IErrors {
  message: string | null;
  name: string;
}
const INITIAL_STATE = {
  message: null,
  name: "",
};

export function SummaryForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<IErrors>(INITIAL_STATE);
  const [value, setValue] = useState<string>("");
  const [youtubeId, setYoutubeId] = useState<string>("");
  const [toastId, setToastId] = useState<string | number | undefined>();


    async function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); // 폼의 기본 제출 동작(새로고침 등)을 막음
    setLoading(true); // 로딩 상태 true로 설정

    const formData = new FormData(event.currentTarget); 
    const videoId = formData.get("videoId") as string; // 입력된 videoId 가져오기
    const processedVideoId = extractYouTubeID(videoId); // 유튜브 ID 추출

    // 유효하지 않은 경우 처리
    if (!processedVideoId) {
        toast.error("잘못된 유튜브 영상 ID입니다");
        setLoading(false);
        setValue("");
        setError({
        ...INITIAL_STATE,
        message: "잘못된 유튜브 영상 ID입니다",
        name: "Invalid Id",
        });
        return;
    }

    setYoutubeId(processedVideoId);
    let currentToastId: string | number | undefined;

    try {
        // 1단계: 자막 가져오기
        currentToastId = toast.loading("자막을 가져오는 중...");
        



        // 2단계: 요약 생성
        toast.dismiss(currentToastId);
        currentToastId = toast.loading("요약을 생성하는 중...");
      
        // 3단계: 요약 DB에 저장
        toast.dismiss(currentToastId);
        currentToastId = toast.loading("요약을 저장하는 중...");
       

        setToastId(currentToastId);
        // ✅ 저장이 끝난 시점에 로딩 토스트 닫기
        toast.dismiss(currentToastId);
        
        toast.success("요약 생성 및 저장 완료!");
        


        setValue("");

        // 이후 요약 상세 페이지로 리디렉션
    } catch (error) {
        if (currentToastId) toast.dismiss(currentToastId);
        console.error("에러 발생:", error);
        toast.error(
        error instanceof Error ? error.message : "요약 생성에 실패했습니다"
        );
    } finally {
        setLoading(false);
    }
    }


  function clearError() {
    setError(INITIAL_STATE);
    if (error.message) setValue("");
  }

const errorStyles = error.message
    ? "outline-1 outline outline-red-500 placeholder:text-red-700"
    : "";

  return (
    <div className="w-full flex-1 mx-4">
      {youtubeId && <p className="text-center text-sm text-gray-500">유튜브 영상 ID: {youtubeId}</p>}
      {toastId && <p className="text-center text-sm text-gray-500">toastId: {toastId}</p>}


      <form
        onSubmit={handleFormSubmit}
        className="flex gap-2 items-center"
      >
        <Input name="videoId" 
            placeholder={
                error.message ? error.message : "유튜브 비디오 ID 또는 URL를 입력하세요."                
            }
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onMouseDown={clearError}
            className={
                cn("w-full focus:text-black focus-visible:ring-pink-500",errorStyles)
            }
            required
        />

        <SubmitButton
          text="요약 만들기"
          loadingText="요약 생성 중..."
          className="bg-pink-500"
          loading={loading}
        />
      </form>
    </div>
  );
}
