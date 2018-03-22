const Register = () => import('../accounts/components/Register');
export default [
  {
    path: '/accounts/register',
    component: Register,
    name: 'registerAccount'
  },
  {
    path: '/accounts/logout',
    component: Register,
    name: 'logoutAccount'
  }
];
