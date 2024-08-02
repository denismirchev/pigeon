/**
 * Express router paths go here.
 */

export default {
  Base: '/api',
  Auth: {
    Base: '/auth',
    Login: '/login',
    Register: '/register',
    Logout: '/logout',
    Refresh: '/token',
  },
  Posts: {
    Base: '/posts',
    Create: '/',
    GetAll: '/',
    GetOne: '/:id',
    Delete: '/:id',
    GetByUsername: '/users/:username',
  },
  Users: {
    Base: '/users',
    Get: '/',
    Add: '/',
    Update: '/:id',
    Delete: '/:id',
  },
} as const;
