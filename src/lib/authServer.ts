import { CognitoJwtVerifier } from 'aws-jwt-verify';

const userPoolId = process.env.COGNITO_USER_POOL_ID || process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID;
const clientId = process.env.COGNITO_USER_POOL_CLIENT_ID || process.env.NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID;

if (!userPoolId || !clientId) {
  // eslint-disable-next-line no-console
  console.warn('Cognito verifier: missing userPoolId/clientId envs');
}

const verifier = CognitoJwtVerifier.create({
  userPoolId: userPoolId!,
  tokenUse: 'id',
  clientId: clientId!
});

export async function verifyRequestIdToken(req: Request) {
  const authHeader = req.headers.get('authorization') || req.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;
  const token = authHeader.slice('Bearer '.length);
  
  // Handle mock tokens for local development
  if (token.startsWith('mock-token-')) {
    const email = token.replace('mock-token-', '');
    return { email, sub: email };
  }
  
  // Handle real Cognito tokens
  if (!userPoolId || !clientId) {
    console.warn('Cognito not configured, but received non-mock token');
    return null;
  }
  
  try {
    const payload = await verifier.verify(token);
    return payload as unknown as { email?: string; sub: string };
  } catch {
    return null;
  }
}
