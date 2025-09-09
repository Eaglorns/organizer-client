const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: 'main', component: () => import('pages/IndexPage.vue') },
      { path: 'archive', component: () => import('pages/ArchivePage.vue') },
      { path: 'profile', component: () => import('pages/ProfilePage.vue') },
      { path: 'admin', component: () => import('pages/AdminPage.vue') },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
