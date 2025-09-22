## 🔄 SQLite → MySQL 마이그레이션 방법

### 1. MySQL 설치 및 데이터베이스 준비

MySQL 서버 설치 후 Strapi용 DB 생성:

```sql
CREATE DATABASE strapi_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'strapi_user'@'%' IDENTIFIED BY '비밀번호';
GRANT ALL PRIVILEGES ON strapi_db.* TO 'strapi_user'@'%';
FLUSH PRIVILEGES;
```

---

### 2. Strapi 설정 변경

`config/database.ts` (또는 `config/database.js`)에서 SQLite 설정을 MySQL로 교체합니다:

```ts
export default ({ env }) => ({
  connection: {
    client: "mysql2",
    connection: {
      host: env("DATABASE_HOST", "127.0.0.1"),
      port: env.int("DATABASE_PORT", 3306),
      database: env("DATABASE_NAME", "strapi_db"),
      user: env("DATABASE_USERNAME", "strapi_user"),
      password: env("DATABASE_PASSWORD", "비밀번호"),
      ssl: env.bool("DATABASE_SSL", false),
    },
  },
});
```

---

### 3. 데이터 이전 (Migration)

데이터를 그대로 가져오려면 두 가지 방법이 있습니다.

#### (1) Export / Import 방식

- SQLite 데이터를 **SQL 덤프**로 추출:

```bash
sqlite3 ./data.db .dump > dump.sql
```

- 덤프 파일을 MySQL 호환 형식으로 변환 (데이터 타입, `AUTOINCREMENT` → `AUTO_INCREMENT`, 따옴표 처리 등 수정 필요).
- MySQL에 import:

```bash
mysql -u strapi_user -p strapi_db < dump.sql
```

#### (2) 전용 마이그레이션 툴 사용

- **DB 마이그레이션 툴** (예: [dbmate](https://github.com/amacneil/dbmate), [Prisma Data Proxy](https://www.prisma.io/), Navicat, DBeaver)로 SQLite → MySQL 변환.
- GUI 툴로 컬럼 타입을 조정하면서 Import 가능.

---

### 4. Strapi 실행 및 확인

```bash
npm run build
npm run develop
```

- 데이터가 잘 들어왔는지 Admin 페이지에서 확인.
- 만약 마이그레이션 과정에서 타입 불일치가 발생하면 컬럼 스키마를 수동 수정해야 함 (특히 `json`, `text`, `datetime` 필드).

---

## ⚠️ 주의할 점

1. **User, Roles, Permissions** 테이블은 구조가 중요하므로 반드시 올바르게 매핑해야 합니다.  
2. SQLite에서는 `json` 타입이 자유롭지만, MySQL은 `LONGTEXT`나 `JSON`으로 맞춰야 함.  
3. Migration 후 반드시 `npm run build`를 실행해야 정상 동작.  

---

👉 정리하면: 가능하지만, **SQLite → MySQL은 직접 변환 작업이 필요**합니다.  
개발 단계에서 SQLite를 쓰고, 배포 단계에서 MySQL(PostgreSQL)로 옮기는 게 일반적인 워크플로.
