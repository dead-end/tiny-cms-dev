import type {
    TValidatorCreator,
    TValidatorDefinition
} from '../types/validators'

/**
 * The function checks if an error message is defined for the validator. If not
 * it returns the default error message.
 */
const getError = (validator: TValidatorDefinition, msg: string) => {
    if (validator.msg) {
        return validator.msg
    }
    return msg
}

/**
 * The function ensures that the form field has a value.
 */
export const validateRequired: TValidatorCreator = (validator) => {
    return (value) => {
        if (!value) {
            return getError(validator, 'Please enter a value!')
        }
    }
}

/**
 * The function checks the min of a value.
 */
// TODO: check other types
export const validateMin: TValidatorCreator = (validator) => {
    if (typeof validator.props?.min !== 'number') {
        throw new Error('Validator: "min" required numeric property!')
    }
    const min = validator.props.min
    return (value) => {
        if (value === '') {
            return
        }

        if (value.length < min) {
            return getError(validator, `The minumum length is: ${min}`)
        }
    }
}

/**
 * The function checks the max of a value.
 */
// TODO: check other types
export const validateMax: TValidatorCreator = (validator) => {
    if (typeof validator.props?.max !== 'number') {
        throw new Error('Validator: "max" required numeric property!')
    }
    const max = validator.props.max
    return (value) => {
        if (value === '') {
            return
        }

        if (value.length > max) {
            return getError(validator, `The maximum length is: ${max}`)
        }
    }
}

/**
 * The function checks if the value matches a regex.
 */
export const validateRegex: TValidatorCreator = (validator) => {
    if (!validator.props || !validator.props.regex) {
        throw new Error(
            'Validator: "validateRegex" requires a "regex" property!'
        )
    }
    const regex = new RegExp(validator.props.regex)

    return (value) => {
        if (value !== '' && !regex.test(value)) {
            return getError(validator, `Value does not match ${regex}`)
        }
    }
}

/**
 * The function checks if two fields of the form have the same value.
 */
export const validateFieldEquals: TValidatorCreator = (validator) => {
    if (!validator.props || !validator.props.field) {
        throw new Error(
            'Validator: "fieldEquals" requires a "field" and a "msg" property!'
        )
    }

    const field = validator.props.field
    return (value, formData) => {
        if (value !== formData.get(field)) {
            return getError(validator, `Value does not match field: ${field}`)
        }
    }
}

/**
 * Registry for the validators.
 */
export const validatorRegistry: Record<string, TValidatorCreator> = {
    required: validateRequired,
    min: validateMin,
    max: validateMax,
    regex: validateRegex,
    fieldEquals: validateFieldEquals
}
