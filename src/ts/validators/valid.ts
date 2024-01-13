import type { TValidator } from "./validators";

export const useForm = (fieldValidators: Record<string, TValidator[]>) => {
    const initFieldErrors = () => {
        let fieldErrors: Record<string, string> = {};


        for (const name in fieldValidators) {
            fieldErrors[name] = '';
        }

        return fieldErrors
    }

    let fieldErrors = initFieldErrors();

    const validateField = (
        formData: FormData,
        name: string,
        validators: TValidator[],
        fieldErrors: Record<string, string>
    ) => {
        fieldErrors[name] = "";

        for (const validator of validators) {
            const msg = validator(formData.get(name), formData);
            if (msg) {
                fieldErrors[name] = msg;
                return false;
            }
        }
        return true;
    };

    const validateForm = (
        formData: FormData,
    ) => {
        let ok = true;
        for (const name in fieldValidators) {
            if (!validateField(formData, name, fieldValidators[name], fieldErrors)) {
                ok = false;
            }
        }
        return ok;
    };

    return { fieldErrors, validateForm }
}