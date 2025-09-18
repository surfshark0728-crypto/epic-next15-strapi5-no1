"use client";

import { useRouter } from "next/navigation";
import { RefreshCw, AlertTriangle, ArrowLeft } from "lucide-react";

const styles = {
  container: "min-h-[calc(100vh-200px)] flex items-center justify-center p-4",
  content:
    "max-w-2xl mx-auto text-center space-y-8 bg-gradient-to-br from-red-50 to-orange-50 rounded-xl shadow-lg p-8",
  textSection: "space-y-4",
  headingError: "text-8xl font-bold text-red-600 select-none",
  headingContainer: "relative",
  pageTitle: "text-4xl font-bold text-gray-900 mb-4",
  description: "text-lg text-gray-600 max-w-md mx-auto leading-relaxed",
  illustrationContainer: "flex justify-center py-8",
  illustration: "relative animate-pulse",
  errorCircle:
    "w-24 h-24 bg-red-100 rounded-full flex items-center justify-center transition-all duration-300 hover:bg-red-200",
  errorIcon: "w-16 h-16 text-red-500",
  warningBadge:
    "absolute -top-2 -right-2 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center animate-bounce",
  warningSymbol: "text-orange-500 text-xl font-bold",
  buttonContainer:
    "flex flex-col sm:flex-row gap-4 justify-center items-center",
  button: "min-w-[160px] bg-red-600 hover:bg-red-700 text-white",
  buttonContent: "flex items-center gap-2",
  buttonIcon: "w-4 h-4",
  outlineButton: "min-w-[160px] border-red-600 text-red-600 hover:bg-red-50",
  errorDetails:
    "mt-8 p-4 bg-red-50 border border-red-200 rounded-lg text-left text-sm text-red-800",
  errorTitle: "font-semibold mb-2",
};


interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  const router = useRouter();

  return (
    // 📌 전체 화면 컨테이너
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center space-y-8 bg-gradient-to-br from-red-50 to-orange-50 rounded-xl shadow-lg p-8">
        
        {/* 📌 에러 제목 섹션 */}
        <div className="space-y-4">
          <h1 className="text-8xl font-bold text-red-600 select-none">에러</h1>
          <div className="relative">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">요약 불러오기 실패</h2>
            <p className="text-lg text-gray-600 max-w-md mx-auto leading-relaxed">
              요약 정보를 불러오는 중 오류가 발생했습니다.  
              잠시 후 다시 시도해주세요.
            </p>
          </div>
        </div>

        {/* 📌 경고 아이콘 애니메이션 */}
        <div className="flex justify-center py-8">
          <div className="relative animate-pulse">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center transition-all duration-300 hover:bg-red-200">
              <AlertTriangle className="w-16 h-16 text-red-500" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center animate-bounce">
              <span className="text-orange-500 text-xl font-bold">!</span>
            </div>
          </div>
        </div>

        {/* 📌 버튼 영역 */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          {/* 다시 시도 버튼 */}
          <button
            onClick={reset}
            className="min-w-[160px] bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            다시 시도
          </button>

          {/* 이전 페이지로 돌아가기 버튼 */}
          <button
            onClick={() => router.back()}
            className="min-w-[160px] border-red-600 text-red-600 hover:bg-red-50 px-6 py-3 rounded-lg font-medium border-2 transition-colors inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            뒤로 가기
          </button>
        </div>

        {/* 📌 개발 모드에서만 표시되는 에러 상세 */}
        {process.env.NODE_ENV === "development" && (
          <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg text-left text-sm text-red-800">
            <div className="font-semibold mb-2">에러 상세 (개발 모드 전용):</div>
            <div>메시지: {error.message}</div>
            {error.digest && <div>다이제스트: {error.digest}</div>}
            {error.stack && (
              <details className="mt-2">
                <summary className="cursor-pointer font-medium">스택 추적 보기</summary>
                <pre className="mt-2 text-xs overflow-auto">{error.stack}</pre>
              </details>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
