// src/lib/auth-helpers.ts
import { getAuthTokenAction } from "@/data/actions/auth";
import { services } from "@/data/services";
import type { TAuthUser } from "@/types";

/**
 * 인증된 사용자와 JWT 토큰을 가져오는 헬퍼 함수
 * - JWT 토큰이 없으면 에러 발생
 * - 사용자 정보를 불러오지 못하면 에러 발생
 */
export async function requireAuthUser(): Promise<{
  authToken: string;
  user: TAuthUser;
}> {
  // JWT 가져오기
  const authToken = await getAuthTokenAction();
  if (!authToken) {
    throw new Error("로그인이 필요합니다.");
  }

  // 사용자 정보 조회
  const me = await services.auth.getUserMeService(authToken);
  if (!me.success || !me.data) {
    throw new Error("사용자 정보를 불러올 수 없습니다.");
  }

  return { authToken, user: me.data };
}
