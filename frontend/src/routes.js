const apiPath = '/api/v1';

const routes = {
  loginPath: () => [apiPath, 'login'].join('/'),
  getData: () => [apiPath, 'data'].join('/'),
  signUp: () => [apiPath, 'signup'].join('/'),
  notFoundPage: () => '*',
  mainPage: () => '/',
  loginPage: () => '/login',
  signUpPage: () => '/signup',
};

export default routes;
