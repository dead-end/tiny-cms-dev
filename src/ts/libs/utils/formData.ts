/**
 * Get the value from form data as a string.
 */
export const formDataStr = (formData: FormData, key: string, error: string) => {
    const tmp = formData.get(key)
    if (!tmp) {
        throw new Error(error)
    }
    return tmp as string
}

/**
 * The function ensures that a FormData values exists and has a string value.
 * This value is returned.
 */
export const formDataStrValue = (value: FormDataEntryValue | null): string => {
    if (value === null || typeof value !== 'string') {
        throw Error(`Invalid value: ${value}`)
    }
    return value.trim()
}
