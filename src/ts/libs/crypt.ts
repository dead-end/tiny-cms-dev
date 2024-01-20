import { arrayBufferToBase64, base64ToArrayBuffer } from "./utils";

/**
 * The function creates random data and stores it in the local storage.
 */
const getStoredRandomBytes = (key: string, length: number) => {
  const stored = localStorage.getItem(key);
  if (stored) {
    const arrBuf = base64ToArrayBuffer(stored);
    return new Uint8Array(arrBuf)
  }

  const iv = crypto.getRandomValues(new Uint8Array(length));
  const base64 = arrayBufferToBase64(iv.buffer);
  localStorage.setItem(key, base64);
  return iv;
};

/**
 * The function returns salt.
 */
const getSalt = () => {
  return getStoredRandomBytes("salt", 12);
};

/**
 * The function return an iv as an Uint8Array
 */
const getIvU8Arr = () => {
  return crypto.getRandomValues(new Uint8Array(12));
}

/**
 * The function creates a derived key from a password.
 */
const getKey = async (pwd: string, salt: Uint8Array) => {
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

/**
 * The function calls the crypto web api to encrypt a string.
 */
const rawEncrypt = async (key: CryptoKey, iv: Uint8Array, msg: string) => {
  const encArrBuf = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv,
    },
    key,
    new TextEncoder().encode(msg)
  );

  return encArrBuf;
};

/**
 * The function calls the crypto web api to decrypt a string.
 */
const rawDecrypt = async (key: CryptoKey, iv: Uint8Array, encArrBuf: ArrayBuffer) => {

  const decArrBuf = await window.crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv,
    },
    key,
    encArrBuf
  );

  return new TextDecoder().decode(decArrBuf);
};

/**
 * The function encrypts a string with a derived key and returns the result as
 * a base64 string.
 */
export const encrypt = async (data: string, password: string) => {
  const ivU8Arr = getIvU8Arr();

  const key = await getKey(password, getSalt())
  const encArrBuf = await rawEncrypt(key, ivU8Arr, data)

  const encBase64 = arrayBufferToBase64(encArrBuf);
  const ivBase64 = arrayBufferToBase64(ivU8Arr.buffer);

  const encrypted = ivBase64 + '#' + encBase64

  return encrypted
}

/**
 * The function is called with a encrypted, base64 string and decrypts it. The
 * plain text is returned.
 */
export const decrypt = async (encrypted: string, password: string) => {
  const [ivBase64, encBase64] = encrypted.split('#')

  const ivArrBuff = base64ToArrayBuffer(ivBase64)
  const encArrBuf = base64ToArrayBuffer(encBase64)

  const ivU8Arr = new Uint8Array(ivArrBuff)

  const key = await getKey(password, getSalt())
  const decrypted = await rawDecrypt(key, ivU8Arr, encArrBuf)

  return decrypted
}