export type TValidator = (value: any, formData: FormData) => string | void;

export const requiredValidator: TValidator = (value) => {
    if (!value) {
        return "Please enter a value!";
    }
};

export const validateFieldEquals = (field: string, msg: string): TValidator => {
    return (value, formData) => {
        if (value !== formData.get(field)) {
            return msg;
        }
    };
};