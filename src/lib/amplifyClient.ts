import { Amplify, type ResourcesConfig } from 'aws-amplify';

export function configureAmplify() {
  const userPoolId = process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID;
  const clientId = process.env.NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID;
  if (!userPoolId || !clientId) {
    console.warn('[Amplify] Skipping configuration: missing Cognito env vars. Set NEXT_PUBLIC_COGNITO_USER_POOL_ID and NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID.');
    return;
  }
  const cognito = {
    userPoolId,
    userPoolClientId: clientId,
    ...(process.env.NEXT_PUBLIC_COGNITO_IDENTITY_POOL_ID
      ? { identityPoolId: process.env.NEXT_PUBLIC_COGNITO_IDENTITY_POOL_ID as string }
      : {}),
    loginWith: { email: true },
    ...(process.env.NEXT_PUBLIC_COGNITO_OAUTH_DOMAIN && process.env.NEXT_PUBLIC_SITE_URL
      ? {
          oauth: {
            domain: process.env.NEXT_PUBLIC_COGNITO_OAUTH_DOMAIN,
            scope: ['email', 'openid', 'phone', 'profile'],
            redirectSignIn: [process.env.NEXT_PUBLIC_SITE_URL],
            redirectSignOut: [process.env.NEXT_PUBLIC_SITE_URL],
            responseType: 'code'
          }
        }
      : {})
  };
  const cfg = { Auth: { Cognito: cognito } } as unknown as ResourcesConfig;
  Amplify.configure(cfg);
}
