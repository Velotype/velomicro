// deno-lint-ignore-file no-explicit-any

/** JSX namespace */
export namespace JSXInternal {
    /** JSX types for elements and their accepted attributes, in Micro just set to any */
    interface IntrinsicElements {
        /** Allow all attributes for all elements */
        [elementName: string]: any
    }
}
