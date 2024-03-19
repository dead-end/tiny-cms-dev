/**
 * The definition of a validator.
 *
 * validator: id
 * msg: error message
 */
export type TValidatorDefinition = {
    validator: string
    props?: Record<string, any>
    msg?: string
}

/**
 * The definition of a validation function. It is called with the value that
 * should be validated and the form data, if the validation should involve
 * other values. It returns an error string or void if the value is ok.
 */
export type TValidatorFunction = (
    value: any,
    formData: FormData
) => string | void

/**
 * The definition of a factory function that retuns a parameterazed version
 * of a validator.
 */
export type TValidatorCreator = (
    validator: TValidatorDefinition
) => TValidatorFunction
