import { SignJWT, jwtVerify } from 'jose';

const secretKey = process.env.SESSION_SECRET;
const key = new TextEncoder().encode(secretKey);

if (!secretKey) {
  throw new Error('SESSION_SECRET environment variable is not set');
}

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(key);
}

export async function decrypt(input: string): Promise<any> {
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
