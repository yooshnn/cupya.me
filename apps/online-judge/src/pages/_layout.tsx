import type { ReactNode } from 'react';
import { Footer } from '../components/footer';
import { Header } from '../components/header';
import 'katex/dist/katex.min.css';
import '../styles.css';

interface RootLayoutProps {
  children: ReactNode;
}

const themeScript = `
try {
  var storedTheme = localStorage.getItem('online-judge:theme');
  var prefersLight = matchMedia('(prefers-color-scheme: light)').matches;
  var isLight = storedTheme ? storedTheme === 'light' : prefersLight;
  document.documentElement.classList.toggle('light', isLight);
}
catch {
}
`;

export default async function RootLayout({ children }: RootLayoutProps) {
  return (
    <div className="flex min-h-svh flex-col bg-bg text-label">
      <meta
        name="description"
        content="직접 만든 알고리즘 문제를 읽고 브라우저에서 C++ 코드를 채점하는 문제 아카이브"
      />
      <link rel="icon" type="image/png" href="/images/favicon.png" />
      <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      <Header />
      <main className="flex flex-1 flex-col">{children}</main>
      <Footer />
    </div>
  );
}

export const getConfig = async () => {
  return {
    render: 'static',
  } as const;
};
