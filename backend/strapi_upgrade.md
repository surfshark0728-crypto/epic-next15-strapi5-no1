업데이트 명령어

5.23.1 → 5.23.4 (패치 버전) 업데이트하려면:

yarn 사용 시
yarn upgrade @strapi/strapi@5.23.4

npm 사용 시
npm install @strapi/strapi@5.23.4

3. 관련 Strapi 패키지 같이 맞추기

Strapi는 core + plugin 패키지 버전을 같이 맞춰야 합니다.
즉, @strapi/plugin-*, @strapi/admin, @strapi/content-type-builder 등도 전부 동일 버전으로 업그레이드해야 합니다.

예시:

yarn upgrade @strapi/strapi@5.23.4 \
             @strapi/admin@5.23.4 \
             @strapi/plugin-users-permissions@5.23.4 \
             @strapi/plugin-i18n@5.23.4 \
             @strapi/plugin-cloud@5.23.4


보통 package.json 안의 dependencies에서 @strapi/* 전부 확인 후 버전 5.23.4로 맞추면 됩니다.

4. 캐시/노드모듈 정리 후 재설치

문제 생길 수 있으니:

rm -rf node_modules
rm yarn.lock   # 또는 package-lock.json
yarn install   # (npm이면 npm install)

5. DB 마이그레이션/빌드
yarn build
yarn develop