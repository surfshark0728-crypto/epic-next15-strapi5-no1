import { notFound } from "next/navigation";
import type { TStrapiResponse } from "@/types";

/**
 * 모든 라우트에서 API 응답 에러를 일관되게 처리합니다.
 *
 * @param data - API 응답 데이터
 * @param resourceName - 에러 메시지를 더 명확하게 하기 위한 선택적 리소스 이름 (예: "summary", "user")
 * @throws Error 응답이 실패를 나타내는 경우 (404 이외의 에러)
 * @returns void - 성공 시 아무 동작도 하지 않으며, 실패 시 예외를 발생시키거나 리다이렉트합니다.
 */
export function handleApiError<T>(
  data: TStrapiResponse<T> | null | undefined,
  resourceName?: string
): void {
  if (!data) {
    throw new Error(`${resourceName || "리소스"}를 불러오지 못했습니다.`);
  }

  // 404 에러는 특별히 notFound()로 처리
  if (data?.error?.status === 404) {
    notFound();
  }

  // 그 외 모든 API 에러 처리
  if (!data?.success || !data?.data) {
    const errorMessage =
      data?.error?.message || `${resourceName || "리소스"}를 불러오지 못했습니다.`;
    throw new Error(errorMessage);
  }
}

/**
 * API 응답을 검증하고 데이터를 추출하며, 에러는 자동으로 처리합니다.
 *
 * @param data - API 응답 데이터
 * @param resourceName - 에러 메시지를 더 명확하게 하기 위한 선택적 리소스 이름
 * @returns 응답에서 추출된 데이터
 * @throws Error 응답이 실패를 나타내는 경우
 */
export function validateApiResponse<T>(
  data: TStrapiResponse<T> | null | undefined,
  resourceName?: string
): T {
  handleApiError(data, resourceName);
  return data!.data!;
}
