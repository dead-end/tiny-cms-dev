import { base64ToBytes, bytesToBase64 } from "byte-base64";

/**
 *
 */
export const doDecrypt = async (
  key: CryptoKey,
  iv: Uint8Array,
  base64: string
) => {
  const uint8Array = base64ToBytes(base64);
  const encArrBuf = uint8Array.buffer;

  const decArrBuf = await window.crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    key,
    encArrBuf
  );

  return new TextDecoder().decode(decArrBuf);
};

/**
 *
 */
export const doEncrypt = async (
  key: CryptoKey,
  iv: Uint8Array,
  msg: string
) => {
  const encArrBuf = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv,
    },
    key,
    new TextEncoder().encode(msg)
  );

  return bytesToBase64(new Uint8Array(encArrBuf));
};

/**
 *
 */
const getStoredRandomBytes = (key: string, length: number) => {
  const stored = localStorage.getItem(key);
  if (stored) {
    return base64ToBytes(stored);
  }

  const iv = crypto.getRandomValues(new Uint8Array(length));
  const base64 = bytesToBase64(iv);
  localStorage.setItem(key, base64);
  return iv;
};

/**
 * The function creates a derived key from a password.
 */
export const getKey = async (pwd: string, salt: Uint8Array) => {
  const importKey = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(pwd),
    "PBKDF2",
    false, // extractable
    ["deriveKey"]
  );

  const deriveKey = await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: 250000,
      hash: "SHA-256",
    },
    importKey,
    { name: "AES-GCM", length: 256 },
    false, // extractable
    ["encrypt", "decrypt"]
  );

  return deriveKey;
};

export const getSalt = () => {
  return getStoredRandomBytes("salt", 12);
};

export const getIv = () => {
  return getStoredRandomBytes("iv", 12);
};
