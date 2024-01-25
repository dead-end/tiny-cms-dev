/**
 * The definition of a validation function. It is called with the value that
 * should be validated and the form data, if the validation should involve
 * other values. It returns an error string or void if the value is ok.
 */
export type TValidator = (value: any, formData: FormData) => string | void;

/**
 * The definition of a factory function that retuns a parameterazed version
 * of a validator.
 */
export type TValidate = (propy: Record<string, any> | void) => TValidator;

/**
 * The function ensures that the form field has a value.
 */
export const validateRequired: TValidate = () => {
    return (value) => {
        if (!value) {
            return 'Please enter a value!';
        }
    }
};

/**
 * The function checks the min of a value, depending on the type of the field.
 */
export const validateMin: TValidate = (props) => {
    if (!props || typeof props.min !== 'number') {
        throw new Error('Validator: "min" required numeric property!')
    }
    return (value) => {
        if (typeof value === 'string') {
            if (value.length < props.min) {
                return `The minumum length is: ${props.min}`;
            }
        } else if (typeof value === 'number') {
            if (value < props.min) {
                return `The minumum value is: ${props.min}`;
            }
        }
    };
};

/**
 * The function checks the max of a value, depending on the type of the field.
 */
export const validateMax: TValidate = (props) => {
    if (!props || typeof props.max !== 'number') {
        throw new Error('Validator: "max" required numeric property!')
    }
    return (value) => {
        if (typeof value === 'string') {
            if (value.length > props.max) {
                return `The maximum length is: ${props.max}`;
            }
        } else if (typeof value === 'number') {
            if (value > props.max) {
                return `The maximum value is: ${props.max}`;
            }
        }
    };
};

/**
 * The function checks if two fields of the form have the same value.
 */
export const validateFieldEquals: TValidate = (props) => {
    if (!props || !props.field || !props.msg) {
        throw new Error('Validator: "fieldEquals" a "field" and a "msg" property!')
    }
    return (value, formData) => {
        if (value !== formData.get(props.field)) {
            return props.msg;
        }
    };
};

/**
 * Registry for the validators.
 */
export const ValidatorRegistry: Record<string, TValidate> = {
    'required': validateRequired,
    'min': validateMin,
    'max': validateMax,
    'fieldEquals': validateFieldEquals
}
