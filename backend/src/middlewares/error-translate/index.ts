// ./src/middlewares/error-translate/index.ts
export default (config: any, { strapi }: { strapi: any }) => {
  return async (ctx: any, next: () => Promise<void>) => {
    try {
      await next();
    } catch (err: any) {
      // Strapi 로그에 원본 에러 기록
      strapi.log.error(err);

      // HTTP 상태 코드
      ctx.status = err.status || 500;

      // 한국어 번역 메시지
      let message = '서버 내부 오류가 발생했습니다.';

      console.log('🔖🔖 Original error message:', err.message);

      // 간단한 번역 예시 (필요하면 더 세부적으로 매핑 가능)
      if (err.message.includes('not found')) message = '요청한 리소스를 찾을 수 없습니다.';
      else if (err.message.includes('Validation')) message = '데이터 검증에 실패했습니다.';
      else if (err.message.includes('Unauthorized')) message = '권한이 없습니다.';
      

      ctx.body = {
        error: {
          status: ctx.status,
          message,
        },
      };
    }
  };
};