/**
 * Definition of a button for the popup window.
 */
export type TButton = {
    label: string
    onclick: () => void
}

/**
 * Definition of the component for an input field.
 */
export type TComponent = {
    component: any
    validators: string[]
}
