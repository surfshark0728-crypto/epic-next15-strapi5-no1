import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { actions } from "./data/actions";


// 보호된 라우트 배열 정의
const protectedRoutes: string[] = ["/dashboard", "/dashboard/*"];

// 경로가 보호된 라우트인지 확인하는 헬퍼 함수
function isProtectedRoute(path: string): boolean {
  if (!path || protectedRoutes.length === 0) return false;
  return protectedRoutes.some((route) => {
    // 정확히 일치하는 경우
    if (!route.includes("*")) {
      return path === route;
    }

    // 와일드카드 라우트 처리 (예: /dashboard/*)
    const basePath = route.replace("/*", "");
    return path === basePath || path.startsWith(`${basePath}/`);
  });
}

export async function middleware(request: NextRequest) {
  const currentPath = request.nextUrl.pathname;

  // 보호된 라우트에 대해서만 인증 검증 실행
  if (isProtectedRoute(currentPath)) {
    try {
      // getUserMe 서비스로 사용자 인증 검증
      // 1. 토큰이 존재하고 유효한지 확인
      // 2. 데이터베이스에 사용자가 존재하는지 확인
      // 3. 사용자 계정이 활성 상태인지 확인 (차단/삭제 여부)
      const userResponse = await actions.auth.getUserMeAction();

      // 사용자 인증 실패 시 로그인 페이지로 리다이렉트
      if (!userResponse.success || !userResponse.data) {
        return NextResponse.redirect(new URL("/signin", request.url));
      }

      // 인증 성공 → 보호된 라우트로 이동 허용
      return NextResponse.next();
    } catch (error) {
      // getUserMe 호출 중 에러 발생 시 로그인 페이지로 리다이렉트
      console.error("미들웨어 인증 에러:", error);
      return NextResponse.redirect(new URL("/signin", request.url));
    }
  }

  return NextResponse.next();
}

// 성능 최적화를 위한 매처 설정
export const config = {
  matcher: [
    // /dashboard 및 /dashboard 하위 경로와 일치
    /*
     * 다음 경로를 제외한 모든 요청 경로와 일치:
     * - api (API 라우트)
     * - _next/static (정적 파일)
     * - _next/image (이미지 최적화 파일)
     * - favicon.ico (파비콘 파일)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
    "/dashboard",
    "/dashboard/:path*",
  ],
};
