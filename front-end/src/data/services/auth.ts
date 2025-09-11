import { getStrapiURL } from "@/lib/utils";
import type { TStrapiResponse, TImage } from "@/types";

// 회원가입 시 필요한 데이터 타입 정의
type TRegisterUser = {
  username: string;
  password: string;
  email: string;
};

// 로그인 시 필요한 데이터 타입 정의
type TLoginUser = {
  identifier: string; // 사용자명 또는 이메일
  password: string;
};

// 인증된 사용자 정보 타입 정의
type TAuthUser = {
  id: number;
  documentId: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
  image?: TImage;
  credits?: number;
  provider: string; // 인증 제공자 (local 등)
  confirmed: boolean; // 이메일 인증 여부
  blocked: boolean; // 차단 여부
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
};

// Strapi 인증 응답 타입 정의
type TAuthResponse = {
  jwt: string; // 인증 토큰
  user: TAuthUser; // 사용자 정보
};

// 서비스 응답 타입 (성공 또는 에러)
type TAuthServiceResponse = TAuthResponse | TStrapiResponse<null>;

// 응답이 에러인지 확인하는 타입 가드 함수
export function isAuthError(
  response: TAuthServiceResponse
): response is TStrapiResponse<null> {
  return "error" in response;
}

// 응답이 성공인지 확인하는 타입 가드 함수
export function isAuthSuccess(
  response: TAuthServiceResponse
): response is TAuthResponse {
  return "jwt" in response;
}

// Strapi 기본 URL 가져오기
const baseUrl = getStrapiURL();

// 회원가입 요청 서비스
export async function registerUserService(
  userData: TRegisterUser
): Promise<TAuthServiceResponse | undefined> {
  const url = new URL("/api/auth/local/register", baseUrl);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...userData }), // 회원가입 데이터 전송
    });

    const data = (await response.json()) as TAuthServiceResponse;
    console.dir(data, { depth: null }); // 응답 데이터 콘솔 출력
    return data;
  } catch (error) {
    console.error("Registration Service Error:", error); // 에러 로그 출력
    return undefined;
  }
}

// 로그인 요청 서비스
export async function loginUserService(
  userData: TLoginUser
): Promise<TAuthServiceResponse> {
  const url = new URL("/api/auth/local", baseUrl);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...userData }), // 로그인 데이터 전송
    });

    return response.json() as Promise<TAuthServiceResponse>; // 응답 반환
  } catch (error) {
    console.error("Login Service Error:", error); // 에러 로그 출력
    throw error;
  }
}
