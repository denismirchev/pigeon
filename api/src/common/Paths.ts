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
    Create: '/create',
    Get: '/all',
  },
  Users: {
    Base: '/users',
    Get: '/all',
    Add: '/add',
    Update: '/update',
    Delete: '/delete/:id',
  },
} as const;
