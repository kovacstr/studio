import { SignJWT, jwtVerify } from 'jose';

// Use a default secret for build time, but require it for production runtime.
const secretKey = process.env.SESSION_SECRET || 'fallback-secret-for-build';
const key = new TextEncoder().encode(secretKey);

if (!process.env.SESSION_SECRET) {
  console.warn(
    'Warning: SESSION_SECRET environment variable is not set. Using a default for build purposes. Please set this in your production environment.'
  );
}

export async function encrypt(payload: any) {
  if (!process.env.SESSION_SECRET) {
    throw new Error('SESSION_SECRET environment variable is not set for runtime.');
  }
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(key);
}

export async function decrypt(input: string): Promise<any> {
  if (!process.env.SESSION_SECRET) {
    // If there's no secret, we can't decrypt anything.
    return null;
  }
  try {
    const { payload } = await jwtVerify(input, key, {
      algorithms: ['HS256'],
    });
    return payload;
  } catch (e) {
    // It's okay if the token is invalid or expired
    return null;
  }
}
