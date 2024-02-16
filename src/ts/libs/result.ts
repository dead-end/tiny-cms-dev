/**
 * Class to get errors to the frontend.
 */
export default class Result<V> {
    private message?: string
    private value?: V

    public hasError() {
        return typeof this.message === 'string'
    }

    public getError() {
        return this.message as string
    }

    public getValue() {
        return this.value as V
    }

    public success(value: V) {
        this.value = value
        return this
    }

    public failed(message: string) {
        console.log(message)
        this.message = message
        return this
    }
}
