import { AUTHORIZATION_SERVER } from './endpoint.env';

export const config = {
    clientId: 'client',
    clientSecret: 'secret',
    redirectUri: 'http://localhost:5555/login/callback',
    scope: 'openid profile',
    responseType: 'code',
    authorizationEndpoint: `${AUTHORIZATION_SERVER}/oauth2/authorize`,
    tokenEndpoint: `${AUTHORIZATION_SERVER}/oauth2/token`,
    codeChallengeMethod: 'S256',
};
