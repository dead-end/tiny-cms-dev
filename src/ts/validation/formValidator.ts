import type { TValidatorFunction } from './validators'

export const createFormValidator = (
    formValidators: Record<string, TValidatorFunction[]>
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
        for (const field in formValidators) {
            if (!validateField(formData, field, formValidators[field])) {
                ok = false
            }
        }
        return ok
    }

    return { formErrors, validateForm }
}
