/**
 * The function ensures that a FormData values exists and has a string value.
 * This value is returned.
 */
export const formDataStrValue = (value: FormDataEntryValue | null): string => {
    if (value === null || typeof value !== "string") {
        throw Error(`Invalid value: ${value}`);
    }
    return value;
};