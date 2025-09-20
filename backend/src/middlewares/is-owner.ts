/**
 * `is-owner` middleware
 * 
 * 목적: API 요청 시 현재 로그인한 사용자가 본인 소유의 데이터만 접근할 수 있도록 제한하는 미들웨어
 */

import type { Core } from "@strapi/strapi";

export default (config, { strapi }: { strapi: Core.Strapi }) => {
  // Strapi 미들웨어는 함수를 반환해야 함
  return async (ctx, next) => {
    strapi.log.info("In is-owner middleware.");

    // 요청된 entry(데이터)의 ID (예: /api/posts/:id 에서 :id 부분)
    const entryId = ctx.params.id;

    // 현재 인증된 사용자 정보 (JWT 인증 후 채워짐)
    const user = ctx.state.user;
    const userId = user?.documentId; // 사용자의 documentId (Strapi v4 기준, PK 역할)

    // 로그인하지 않은 사용자는 접근 불가
    if (!userId) return ctx.unauthorized(`You can't access this entry`);

    // 현재 요청한 API 이름 가져오기 (예: posts, comments 등)
    const apiName = ctx.state.route.info.apiName;

    // 특정 API의 UID를 생성하는 함수 (Strapi 문서 조회 시 필요)
    function generateUID(apiName: string) {
      const apiUid = `api::${apiName}.${apiName}`;
      return apiUid;
    }

    // 현재 API의 UID (예: api::post.post)
    const appUid = generateUID(apiName);

    // 1) 단일 엔트리 접근 (예: GET /api/posts/123)
    if (entryId) {
      // 요청한 entry를 DB에서 가져오기
      const entry = await strapi.documents(appUid as any).findOne({
        documentId: entryId,
        populate: "*", // 연관 데이터도 함께 가져오기
      });

      // entry가 존재하지만, 해당 데이터의 userId가 현재 사용자와 다르면 접근 차단
      if (entry && entry.userId !== userId)
        return ctx.unauthorized(`You can't access this entry`);
    }

    // 2) 여러 엔트리 접근 (예: GET /api/posts)
    if (!entryId) {
      // 쿼리 필터에 userId를 강제로 추가 → 본인 데이터만 보이도록 제한
      ctx.query = {
        ...ctx.query,
        filters: { ...ctx.query.filters, userId: userId },
      };
    }

    // 다음 미들웨어 또는 컨트롤러 실행
    await next();
  };
};
