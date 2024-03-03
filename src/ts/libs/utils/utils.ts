/**
 * The function returns a base64 from an ArrayBuffer.
 */
export const arrayBufferToBase64 = (buffer: ArrayBuffer) => {
    return btoa(String.fromCharCode(...new Uint8Array(buffer)))
}

/**
 * The function returns an ArrayBuffer to a base64 string.
 */
export const base64ToArrayBuffer = (base64: string) => {
    return Uint8Array.from(atob(base64), (c) => c.charCodeAt(0)).buffer
}

/**
 * The function returns an empty string, if the value is not defined.
 */
export const defaultString = (value: any) => {
    return typeof value === 'undefined' ? '' : value
}

/**
 * The function gets a string from something, that was thrown.
 */
export const getErrorMsg = (e: any) => {
    if (e instanceof Error) {
        return e.message
    }
    return JSON.stringify(e)
}
