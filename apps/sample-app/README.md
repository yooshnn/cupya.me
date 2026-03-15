# hello-world

React Router v7 + Cloudflare Workers + D1 레퍼런스 앱.

> 신규 앱 추가 시 이 앱을 참고용으로 사용하세요.

---

## 1. 앱 스캐폴딩

```bash
pnpm create cloudflare@latest my-app --framework=react-router
```

> 이후 설정은 생성된 앱 디렉토리 기준으로 진행합니다.

### 스캐폴딩 후 삭제

```bash
rm -rf .vscode .gitignore
```

---

## 2. 모노레포 설정

### package.json

`name`을 모노레포 컨벤션에 맞게 수정하고, 공유 패키지 및 catalog 의존성을 추가합니다.

```diff
- "name": "my-app",
+ "name": "@cupya.me/my-app",
```

```diff
  "dependencies": {
+   "@cupya.me/db": "workspace:*",
+   "drizzle-orm": "catalog:",
  },
  "devDependencies": {
+   "@cupya.me/eslint-config": "workspace:*",
+   "@cupya.me/typescript-config": "workspace:*",
+   "drizzle-kit": "catalog:",
+   "eslint": "catalog:",
+   "typescript": "catalog:",
  }
```

스크립트도 추가합니다. (D1 migration 관련 `my-app`, `my-app-local`은 wrangler.jsonc의 `database_name`과 일치시키세요.)

```diff
  "scripts": {
+   "lint": "eslint .",
+   "lint:fix": "eslint . --fix",
+   "generate": "drizzle-kit generate",
+   "migrate:local": "wrangler d1 migrations apply my-app-local --local",
+   "migrate:remote": "wrangler d1 migrations apply my-app --remote"
  }
```

### tsconfig

스캐폴딩이 생성한 `tsconfig.json`을 아래 구조로 교체합니다.

**`tsconfig.json`** — references만 선언

```json
{
  "noEmit": true,
  "files": [],
  "references": [
    { "path": "./tsconfig.node.json" },
    { "path": "./tsconfig.cloudflare.json" }
  ]
}
```

**`tsconfig.node.json`**

```json
{
  "extends": "@cupya.me/typescript-config/node",
  "include": ["vite.config.ts", "drizzle.config.ts"]
}
```

**`tsconfig.cloudflare.json`**

```json
{
  "extends": "@cupya.me/typescript-config/react",
  "compilerOptions": {
    "baseUrl": ".",
    "rootDirs": [".", "./.react-router/types"],
    "paths": {
      "~/*": ["./app/*"]
    }
  },
  "include": [
    ".react-router/types/**/*",
    "app/**/*",
    "app/**/.server/**/*",
    "app/**/.client/**/*",
    "workers/**/*",
    "worker-configuration.d.ts"
  ]
}
```

### eslint.config.js

```js
import defineConfig from '@cupya.me/eslint-config';

export default defineConfig(
  {
    react: true,
    ignores: [
      '.wrangler/**',
      '.react-router/**',
      'build/**',
      'dist/**',
      'drizzle/**',
      'worker-configuration.d.ts',
      'react-router.config.ts',
      'package.json',
    ],
  },
  {
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
);
```

---

## 3. Cloudflare Workers 설정

### wrangler.jsonc

로컬 개발용 D1은 `database_id: "local"`으로 설정합니다. 프로덕션 `database_id`는 Cloudflare 대시보드에서 D1 DB 생성 후 입력하세요.

```jsonc
{
  /* 생략 */
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "my-app-local",
      "database_id": "local",
      "migrations_dir": "drizzle/migrations"
    }
  ],
  "env": {
    "production": {
      "d1_databases": [
        {
          "binding": "DB",
          "database_name": "<REMOTE_D1_DATABASE_NAME>",
          "database_id": "<REMOTE_D1_DATABASE_ID>",
          "migrations_dir": "drizzle/migrations"
        }
      ]
    }
  }
}
```

---

## 4. D1 Database 설정

### drizzle.config.ts

```ts
import type { Config } from 'drizzle-kit';

export default {
  schema: './app/server/db/schema.ts',
  out: './drizzle/migrations',
  dialect: 'sqlite',
} satisfies Config;
```

### app/server/db/schema.ts

테이블을 정의합니다. 테이블명에 앱 prefix를 붙여 프로덕션 D1 공유 시 충돌을 방지합니다.

```ts
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const posts = sqliteTable('my_app_posts', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  created_at: text('created_at').notNull(),
});
```

### app/server/db/client.ts

```ts
import { createD1Client } from '@cupya.me/db/d1';
import * as schema from './schema';

export function getDB(d1: D1Database) {
  return createD1Client(d1, schema);
}
```

### Migration

```bash
# SQL 파일 생성
pnpm generate

# 로컬 DB에 적용
pnpm migrate:local

# 프로덕션 DB에 적용
pnpm migrate:remote
```

---

## 5. 로컬 개발

```bash
# 모노레포 루트에서
pnpm install

# 앱 디렉토리에서
pnpm migrate:local
pnpm dev
```
