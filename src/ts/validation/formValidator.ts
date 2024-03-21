import type { TData, TField } from '../types/entries'
import type { TValidatorFunction } from '../types/validators'
import { validatorRegistry } from './validators'

// TODO: native input errors
export const formCreateValidator = (fields?: TField[]) => {
    let formValidators = new Map<string, TValidatorFunction[]>()
    let formErrors = new Map<string, string>()

    /**
     * The function validates the value of a field, by calling all validators of the
     * field. It stops on the first error.
     */
    const validateField = (
        formData: FormData,
        field: string,
        fieldValidators: TValidatorFunction[]
    ) => {
        formErrors.set(field, '')

        for (const validator of fieldValidators) {
            console.log('field', field, validator)
            const msg = validator(formData.get(field), formData)
            if (msg) {
                formErrors.set(field, msg)
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
    const formValidate = (formData: FormData) => {
        let ok = true
        formValidators.forEach((validatorFunctions, field) => {
            if (!validateField(formData, field, validatorFunctions)) {
                ok = false
            }
        })
        return ok
    }

    /**
     * Update the form validators map with the fields.
     */
    const formFieldsUpdate = (fields: TField[]) => {
        fields.forEach((field) => {
            const validatorFunctions: TValidatorFunction[] = []

            field.validators.forEach((validator) => {
                validatorFunctions.push(
                    validatorRegistry[validator.validator](validator)
                )
            })

            formValidators.set(field.id, validatorFunctions)
        })
        return fields
    }

    if (fields) {
        formFieldsUpdate(fields)
    }

    return { formErrors, formValidate, formFieldsUpdate }
}

/**
 * The function checks if the submitted data changed.
 */
export const formDataChanged = (
    fields: TField[],
    formData: FormData,
    data: TData
) => {
    for (const field of fields) {
        if (data[field.id] !== formData.get(field.id)) {
            return true
        }
    }

    return false
}
