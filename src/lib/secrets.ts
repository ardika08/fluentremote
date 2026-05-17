import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;

function getEncryptionKey() {
  const secret =
    process.env.FLUENTREMOTE_ENCRYPTION_SECRET ??
    process.env.BETTER_AUTH_SECRET ??
    "fluentremote-dev-secret";

  return createHash("sha256").update(secret).digest();
}

export function encryptSecret(value: string) {
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, getEncryptionKey(), iv);
  const encrypted = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();

  return `${iv.toString("base64")}.${authTag.toString("base64")}.${encrypted.toString("base64")}`;
}

export function decryptSecret(payload: string) {
  const [ivPart, tagPart, encryptedPart] = payload.split(".");

  if (!ivPart || !tagPart || !encryptedPart) {
    throw new Error("Invalid encrypted payload.");
  }

  const decipher = createDecipheriv(
    ALGORITHM,
    getEncryptionKey(),
    Buffer.from(ivPart, "base64"),
  );
  decipher.setAuthTag(Buffer.from(tagPart, "base64"));

  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(encryptedPart, "base64")),
    decipher.final(),
  ]);

  return decrypted.toString("utf8");
}

export function maskSecret(value: string) {
  const trimmed = value.trim();

  if (!trimmed) return null;
  if (trimmed.length <= 8) return `${trimmed.slice(0, 2)}••••${trimmed.slice(-1)}`;

  return `${trimmed.slice(0, 4)}••••${trimmed.slice(-4)}`;
}
