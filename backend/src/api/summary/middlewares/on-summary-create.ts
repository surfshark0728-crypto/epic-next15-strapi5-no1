/**
 * `on-summary-create` 미들웨어
 */

import type { Core } from "@strapi/strapi";

export default (config, { strapi }: { strapi: Core.Strapi }) => {
  return async (ctx, next) => {
    const user = ctx.state.user;
    if (!user) return ctx.unauthorized("인증되지 않은 사용자입니다.");

    const availableCredits = user.credits;
    if (availableCredits === 0)
      return ctx.unauthorized("사용 가능한 크레딧이 부족합니다.");

    console.log("🔖############ 미들웨어 내부 시작 #############",ctx.state.user.documentId);

    // 요청 본문에 작성자 ID 추가
    const modifiedBody = {
      ...ctx.request.body,
      data: {
        ...ctx.request.body.data,
        userId: ctx.state.user.documentId,
      },
    };

    ctx.request.body = modifiedBody;

    await next();

    // 사용자의 크레딧 차감
    try {
      await strapi.documents("plugin::users-permissions.user").update({
        documentId: user.documentId,
        data: {
          credits: availableCredits - 1,
        },
      });
    } catch (error) {
      ctx.badRequest("사용자 크레딧 업데이트 중 오류가 발생했습니다.");
    }

    console.log("🔖############ 미들웨어 내부 종료 #############");
  };
};
