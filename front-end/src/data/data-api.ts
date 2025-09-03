import type { TStrapiResponse } from "@/types";

type HTTPMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type ApiOptions<P = Record<string, unknown>> = {
  method: HTTPMethod;
  payload?: P;
  timeoutMs?: number;
  authToken?: string;
};

/**
 * 타임아웃 및 인증이 포함된 범용 API 함수
 *
 * 주요 기능:
 * - 모든 HTTP 메서드 지원 (GET, POST, PUT, PATCH, DELETE)
 * - 선택적 인증 지원 (authToken이 있을 경우 Bearer 토큰 추가)
 * - 타임아웃 보호 (기본 8초 → UX와 안정성 균형)
 * - 일관된 에러 처리 및 응답 포맷
 * - DELETE 요청에서 응답 body가 없는 경우 처리
 */
async function apiWithTimeout(
  input: RequestInfo,
  init: RequestInit = {},
  timeoutMs = 8000 // 기본 8초
): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(input, {
      ...init,
      signal: controller.signal, // 타임아웃 시 요청 취소
    });
    return response;
  } finally {
    // 요청 성공/실패 상관없이 항상 타이머 정리 (메모리 누수 방지)
    clearTimeout(timeout);
  }
}

export async function apiRequest<T = unknown, P = Record<string, unknown>>(
  url: string,
  options: ApiOptions<P>
): Promise<TStrapiResponse<T>> {
  const { method, payload, timeoutMs = 8000, authToken } = options;

  // 기본 JSON 통신 헤더 설정
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  // 인증 토큰이 있는 경우 Authorization 헤더 추가
  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }

  try {
    const response = await apiWithTimeout(
      url,
      {
        method,
        headers,
        // GET, DELETE 요청에는 body가 없음
        body:
          method === "GET" || method === "DELETE"
            ? undefined
            : JSON.stringify(payload ?? {}),
      },
      timeoutMs
    );

    // DELETE 요청은 JSON 응답이 없을 수 있으므로 별도 처리
    if (method === "DELETE") {
      return response.ok
        ? { data: true as T, success: true, status: response.status }
        : {
            error: {
              status: response.status,
              name: "Error",
              message: "리소스 삭제 실패",
            },
            success: false,
            status: response.status,
          };
    }

    // DELETE 이외의 요청은 JSON 응답을 파싱
    const data = await response.json();

    // 에러 상태 처리 (4xx, 5xx)
    if (!response.ok) {
      console.error(`API ${method} 에러 (${response.status}):`, {
        url,
        status: response.status,
        statusText: response.statusText,
        data,
        hasAuthToken: !!authToken,
      });

      // Strapi가 구조화된 에러를 반환한 경우 그대로 전달
      if (data.error) {
        return {
          error: data.error,
          success: false,
          status: response.status,
        };
      }

      // 일반적인 에러 응답 생성
      return {
        error: {
          status: response.status,
          name: data?.error?.name ?? "Error",
          message:(data?.error?.message ?? response.statusText )|| "에러가 발생했습니다.",
        },
        success: false,
        status: response.status,
      };
    }

    // 성공 응답 처리
    // Strapi 응답 구조: { data: {...}, meta: {...} }
    // 우리가 원하는 구조: { data: {...}, meta: {...}, success: true, status: 200 }
    const responseData = data.data ? data.data : data;
    const responseMeta = data.meta ? data.meta : undefined;
    return {
      data: responseData as T,
      meta: responseMeta,
      success: true,
      status: response.status,
    };
  } catch (error) {
    // 타임아웃 에러 처리
    if ((error as Error).name === "AbortError") {
      console.error("요청 시간 초과");
      return {
        error: {
          status: 408,
          name: "TimeoutError",
          message: "요청이 시간 초과되었습니다. 다시 시도해주세요.",
        },
        success: false,
        status: 408,
      } as TStrapiResponse<T>;
    }

    // 네트워크 에러, JSON 파싱 에러 등 처리
    console.error(`네트워크/예상치 못한 에러 (${method} ${url}):`, error);
    return {
      error: {
        status: 500,
        name: "NetworkError",
        message:
          error instanceof Error ? error.message : "알 수 없는 오류 발생",
      },
      success: false,
      status: 500,
    } as TStrapiResponse<T>;
  }
}

/**
 * 편의 API 메서드 모음
 *
 * 사용 예시:
 * // 공용 요청
 * const homePage = await api.get<THomePage>('/api/home-page');
 *
 * // 인증 요청
 * const userProfile = await api.get<TUser>('/api/users/me', { authToken: 'your-token' });
 */
export const api = {
  get: <T>(
    url: string,
    options: { timeoutMs?: number; authToken?: string } = {}
  ) => apiRequest<T>(url, { method: "GET", ...options }),

  post: <T, P = Record<string, unknown>>(
    url: string,
    payload: P,
    options: { timeoutMs?: number; authToken?: string } = {}
  ) => apiRequest<T, P>(url, { method: "POST", payload, ...options }),

  put: <T, P = Record<string, unknown>>(
    url: string,
    payload: P,
    options: { timeoutMs?: number; authToken?: string } = {}
  ) => apiRequest<T, P>(url, { method: "PUT", payload, ...options }),

  patch: <T, P = Record<string, unknown>>(
    url: string,
    payload: P,
    options: { timeoutMs?: number; authToken?: string } = {}
  ) => apiRequest<T, P>(url, { method: "PATCH", payload, ...options }),

  delete: <T>(
    url: string,
    options: { timeoutMs?: number; authToken?: string } = {}
  ) => apiRequest<T>(url, { method: "DELETE", ...options }),
};
