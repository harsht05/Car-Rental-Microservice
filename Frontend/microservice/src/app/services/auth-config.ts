import { AuthConfig } from 'angular-oauth2-oidc';

const getRedirectUri = (): string => {
  if (typeof window !== 'undefined') {
    return window.location.origin + '/login/oauth2/code/okta';
  } else {
    return '';
  }
};

export const authConfig: AuthConfig = {
  issuer: 'https://dev-77981882.okta.com/oauth2/default',
  redirectUri:getRedirectUri(),
  clientId: '0oahz89vjwj9jB2aw5d7',
  responseType: 'code',
  scope: 'openid profile email',
  showDebugInformation: true,
  sessionChecksEnabled: true,
  disablePKCE: false,
  requireHttps: false

};
