/**
 * The definition of a validation function. It is called with the value that
 * should be validated and the form data, if the validation should involve
 * other values. It returns an error string or void if the value is ok.
 */
export type TValidator = (value: any, formData: FormData) => string | void;

/**
 * The function ensures that the form field has a value.
 */
export const requiredValidator: TValidator = (value) => {
    if (!value) {
        return "Please enter a value!";
    }
};

/**
 * The function checks if two fields of the form have the same value.
 */
export const validateFieldEquals = (field: string, msg: string): TValidator => {
    return (value, formData) => {
        if (value !== formData.get(field)) {
            return msg;
        }
    };
};

/**
 * The function checks the min / max of a value, depending on the type
 * of the field.
 */
export const validateMinMax = (props: {
    min?: number;
    max?: number;
}): TValidator => {
    return (value) => {
        if (typeof value === "string") {
            if (props.min && value.length < props.min) {
                return `The minumum length is: ${props.min}`;
            }
            if (props.max && value.length > props.max) {
                return `The maximum length is: ${props.max}`;
            }
        } else if (typeof value === "number") {
            if (props.min && value < props.min) {
                return `The minumum value is: ${props.min}`;
            }
            if (props.max && value > props.max) {
                return `The maximum value is: ${props.max}`;
            }
        }
    };
};
