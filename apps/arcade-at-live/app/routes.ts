import type { RouteConfig } from '@react-router/dev/routes';
import { index, route } from '@react-router/dev/routes';

export default [
  index('routes/home.tsx'),
  route('/:slug', 'routes/$slug.tsx'),
  route('/settings', 'routes/settings.tsx'),
] satisfies RouteConfig;
