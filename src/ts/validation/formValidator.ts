import type { TField } from '../types'
import { validatorRegistry, type TValidatorFunction } from './validators'

export const createFormValidator = (
    formValidators: Map<string, TValidatorFunction[]>
) => {
    let formErrors: Record<string, string> = {}

    /**
     * The function validates the value of a field, by calling all validators of the
     * field. It stops on the first error.
     */
    const validateField = (
        formData: FormData,
        field: string,
        fieldValidators: TValidatorFunction[]
    ) => {
        formErrors[field] = ''

        for (const validator of fieldValidators) {
            const msg = validator(formData.get(field), formData)
            if (msg) {
                formErrors[field] = msg
                console.log('Form Error:', msg)
                return false
            }
        }
        return true
    }

    /**
     * The function is calles with the form data and starts all registered validator
     * functions. It returns ok if all validators return ok.
     */
    const validateForm = (formData: FormData) => {
        let ok = true
        formValidators.forEach((validatorFunctions, field) => {
            if (!validateField(formData, field, validatorFunctions)) {
                ok = false
            }
        })
        return ok
    }

    return { formErrors, validateForm }
}

/**
 * Update the form validators map with the fields.
 */
export const updateFormValidator = (
    formValidators: Map<string, TValidatorFunction[]>,
    fields: TField[]
) => {
    formValidators.clear()

    fields.forEach((field) => {
        const validatorFunctions: TValidatorFunction[] = []

        field.validators.forEach((validator) => {
            validatorFunctions.push(
                validatorRegistry[validator.validator](validator.props)
            )
        })

        formValidators.set(field.id, validatorFunctions)
    })
}
