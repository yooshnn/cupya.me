import type { Route } from './+types/root';

import { CactusIcon, WarningCircleIcon } from '@phosphor-icons/react';
import {
  isRouteErrorResponse,
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from 'react-router';

import { Button } from '~/shared/ui/button';
import { EmptyState } from '~/shared/ui/EmptyState';
import './app.css';

declare const __COMMIT_SHA__: string;

export const links: Route.LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <>
      <Outlet />
      <footer className="border-t border-line px-6 py-4 flex items-center justify-end">
        <span className="font-mono text-xs text-label-disable">
          ARCADE@LIVE
          {' '}
          {__COMMIT_SHA__}
        </span>
      </footer>
    </>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const is404 = isRouteErrorResponse(error) && error.status === 404;

  return (
    <div className="min-h-screen bg-bg text-label antialiased">
      <header className="h-16 flex items-center px-6 border-b border-line">
        <span className="text-base font-black tracking-wide">ARCADE@LIVE</span>
      </header>

      <main className="p-6 pb-12">
        <EmptyState
          icon={is404 ? <CactusIcon /> : <WarningCircleIcon />}
          message={is404 ? '404: 페이지를 찾을 수 없습니다.' : '500: 예기치 못한 오류가 발생했습니다.'}
          action={<Button render={<Link to="/" />} nativeButton={false}>홈으로</Button>}
        />

        {import.meta.env.DEV && error instanceof Error && (
          <pre className="mx-auto mt-8 max-w-lg overflow-x-auto rounded-lg border border-line bg-bg-elevated p-4 font-mono text-xs text-label-assistive">
            {error.stack}
          </pre>
        )}
      </main>
    </div>
  );
}
