/**
 * The function ensures that a FormData values exists and has a string value.
 * This value is returned.
 */
export const formDataStrValue = (value: FormDataEntryValue | null): string => {
    if (value === null || typeof value !== "string") {
        throw Error(`Invalid value: ${value}`);
    }
    return value.trim();
};

/**
 * The function returns a base64 from an ArrayBuffer.
 */
export const arrayBufferToBase64 = (buffer: ArrayBuffer) => {
    return btoa(String.fromCharCode(...new Uint8Array(buffer)));
}

/**
 * The function returns an ArrayBuffer to a base64 string.
 */
export const base64ToArrayBuffer = (base64: string) => {
    return Uint8Array.from(atob(base64), c => c.charCodeAt(0)).buffer
}