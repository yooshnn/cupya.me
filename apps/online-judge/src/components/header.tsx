import { Link } from 'waku';

export function Header() {
  return (
    <header className="border-b border-line bg-elevated/95">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <Link to="/" className="text-base font-bold text-label">
          oj.cupya.me
        </Link>
        <nav className="flex items-center gap-4 text-sm font-medium text-label-a">
          <Link to="/problems" className="hover:text-label">
            Problems
          </Link>
        </nav>
      </div>
    </header>
  );
}
