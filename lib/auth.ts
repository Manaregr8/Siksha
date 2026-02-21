import jwt, { type JwtPayload } from "jsonwebtoken";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET;

export type AdminJwtPayload = {
  sub: string;
  role: "admin";
};

export function assertJwtSecret(): string {
  if (!JWT_SECRET) {
    throw new Error("Missing JWT_SECRET env var");
  }
  return JWT_SECRET;
}

export function signAdminJwt(): string {
  const secret = assertJwtSecret();
  const payload: AdminJwtPayload = { sub: "admin", role: "admin" };
  return jwt.sign(payload, secret, { expiresIn: "7d" });
}

export function verifyAdminJwt(token: string): AdminJwtPayload {
  const secret = assertJwtSecret();
  const decoded = jwt.verify(token, secret);
  if (typeof decoded === "string" || decoded === null) {
    throw new Error("Invalid token");
  }
  const payload = decoded as JwtPayload & { role?: unknown; sub?: unknown };
  const role = payload.role;
  const sub = payload.sub;
  if (role !== "admin" || sub !== "admin") {
    throw new Error("Unauthorized");
  }
  return { sub: "admin", role: "admin" };
}

export function getBearerToken(authHeader: string | null): string | null {
  if (!authHeader) return null;
  const [scheme, token] = authHeader.split(" ");
  if (scheme?.toLowerCase() !== "bearer" || !token) return null;
  return token;
}

export function requireAdminFromRequest(req: Request): void {
  const token = getBearerToken(req.headers.get("authorization"));
  if (!token) throw new Error("Missing token");
  verifyAdminJwt(token);
}

export async function verifyAdminCredentials(input: {
  email: string;
  password: string;
}): Promise<boolean> {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;
  if (!adminEmail || !adminPasswordHash) return false;

  if (input.email.toLowerCase() !== adminEmail.toLowerCase()) return false;
  return bcrypt.compare(input.password, adminPasswordHash);
}
