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
    GetOneParents: '/:id/parents',
    GetReplies: '/:id/replies',
    Delete: '/:id',
    GetByUsername: '/users/:username',
    Like: '/:id/like',
    Unlike: '/:id/unlike',
  },
  Users: {
    Base: '/users',
    GetByUsername: '/:username',
    GetByToken: '/user',
    Update: '/',
    Delete: '/:id',
  },
} as const;
