"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, RefreshCw, AlertTriangle } from "lucide-react";
import { FallbackHeader } from "@/components/custom/fallback-header";

const styles = {
  container:
    " min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4",
  content: "max-w-screen-2xl mx-auto text-center space-y-8",
  textSection: "space-y-4",
  headingError: "text-8xl font-bold text-red-600 select-none",
  headingContainer: "relative",
  pageTitle: "text-4xl font-bold text-gray-900 mb-4",
  description: "text-lg text-gray-600 max-w-md mx-auto leading-relaxed",
  illustrationContainer: "flex justify-center py-8",
  illustration: "relative animate-pulse",
  errorCircle:
    "w-32 h-32 bg-red-100 rounded-full flex items-center justify-center transition-all duration-300 hover:bg-red-200",
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

interface IGlobalError {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: IGlobalError) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";


  const handleReset =()=>{
     if (reset) {
      reset(); // Next.js Error Boundary에서 전달된 reset 함수 호출
    } else {
      window.location.reload(); // 기본적으로 페이지 새로고침
    }
  }


  return (
    <html>
      <body>
        <FallbackHeader
          header={{
            logoText: {
              id: 1,
              href: "/",
              label: "Summarize AI",
            },
            ctaButton: {
              id: 1,
              label: "Get Help",
              href: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
              isExternal: true,
            },
          }}
        />

        <div className={styles.container}>
          <div className={styles.content}>
            {/* 큰 에러 텍스트 */}
            <div className={styles.textSection}>
              <h1 className={styles.headingError}>전역 오류</h1>
              <div className={styles.headingContainer}>
                <h2 className={styles.pageTitle}>애플리케이션 오류</h2>
                <p className={styles.description}>
                  애플리케이션을 정상적으로 불러오는 중 심각한 오류가
                  발생했습니다. 페이지를 새로고침하여 다시 시도해 주세요.
                </p>
              </div>
            </div>

            {/* 일러스트 */}
            <div className={styles.illustrationContainer}>
              <div className={styles.illustration}>
                <div className={styles.errorCircle}>
                  <AlertTriangle className={styles.errorIcon} />
                </div>
                <div className={styles.warningBadge}>
                  <span className={styles.warningSymbol}>!</span>
                </div>
              </div>
            </div>

            {/* 액션 버튼 */}
            <div className={styles.buttonContainer}>
              <button
                onClick={handleReset}
                className={`${styles.button} px-6 py-3 rounded-lg font-medium transition-colors cursor-pointer`}
              >
                <div className={styles.buttonContent}>
                  <RefreshCw className={styles.buttonIcon} />
                  다시 시도
                </div>
              </button>

              {!isHomePage && (
                <Link
                  href="/"
                  className={`${styles.outlineButton} px-6 py-3 rounded-lg font-medium border-2 transition-colors inline-flex`}
                >
                  <div className={styles.buttonContent}>
                    <Home className={styles.buttonIcon} />
                    홈으로 이동
                  </div>
                </Link>
              )}
            </div>

            {process.env.NODE_ENV === "development" && (
              <div className={styles.errorDetails}>
                <div className={styles.errorTitle}>
                  오류 상세 정보 (개발 환경에서만 표시):
                </div>
                <div>메시지: {error.message}</div>
                {error.digest && <div>Digest: {error.digest}</div>}
                {error.stack && (
                  <details className="mt-2">
                    <summary className="cursor-pointer font-medium">
                      스택 추적
                    </summary>
                    <pre className="mt-2 text-xs overflow-auto">
                      {error.stack}
                    </pre>
                  </details>
                )}
              </div>
            )}
          </div>
        </div>
      </body>
    </html>
  );
}
