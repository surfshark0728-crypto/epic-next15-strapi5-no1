import qs from "qs";
import { getStrapiURL } from "@/lib/utils";
import type { TStrapiResponse, TSummary } from "@/types";
import { api } from "@/data/data-api";
import { safeRequireAuthToken } from "@/lib/auth-helpers";

const baseUrl = getStrapiURL(); // ✅ Strapi 서버의 기본 URL 가져오기

// 요약(summary) 데이터를 Strapi에 저장하는 서비스 함수
export async function saveSummaryService(
  summaryData: Partial<TSummary> // 저장할 요약 데이터 (일부 속성만 전달 가능)
): Promise<TStrapiResponse<TSummary>> {
  const { data: authToken } = await safeRequireAuthToken();

  // ✅ Strapi의 populate 옵션을 붙여서 관련된 모든 연관 데이터를 가져오도록 쿼리 생성
  const query = qs.stringify({
    populate: "*",
  });

  // ✅ Strapi summaries 컬렉션 API URL 생성
  const url = new URL("/api/summaries", baseUrl);
  url.search = query;

  // ✅ Strapi 규칙: 저장할 데이터는 반드시 { data: ... } 형태로 감싸서 전달해야 함
  const payload = { data: summaryData };

  // ✅ 실제 POST 요청 실행 (api.post<T, P> 제네릭: T = 응답 타입, P = 요청 payload 타입)
  const result = await api.post<TSummary, typeof payload>(url.href, payload, { authToken });

  // ✅ 응답 확인용 로그
  console.log("✅ ######### 실제 저장 요약 응답");
  console.dir(result, { depth: null });

  // ✅ Strapi 응답 반환
  return result;
}
