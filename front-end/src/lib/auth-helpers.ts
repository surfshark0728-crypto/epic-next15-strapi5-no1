// src/lib/auth-helpers.ts
import { getAuthTokenAction } from "@/data/actions/auth";
import { services } from "@/data/services";
import type { TStrapiResponse ,TAuthUser } from "@/types";


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







/**
 * requireAuthUser와 동일하지만 throw 대신 항상 TStrapiResponse<TAuthUser> 형태로 반환
 */
export async function safeRequireAuthUser(): Promise<TStrapiResponse<TAuthUser>> {
  const token = await getAuthTokenAction();

  if (!token) {
    return {
      success: false,
      data: undefined,
      error: {
        status: 401,
        name: "UnauthorizedError",
        message: "로그인이 필요합니다.",
        details: {},
      },
      status: 401,
    };
  }

  const me = await services.auth.getUserMeService(token);

  if (!me.success || !me.data) {
    return {
      success: false,
      data: undefined,
      error: {
        status: me.status ?? 500,
        name: me.error?.name ?? "UserFetchError",
        message: me.error?.message ?? "사용자 정보를 불러올 수 없습니다.",
        details: me.error?.details ?? {},
      },
      status: me.status ?? 500,
    };
  }

  return {
    success: true,
    data: me.data,
    error: undefined,
    status: me.status,
  };
}
