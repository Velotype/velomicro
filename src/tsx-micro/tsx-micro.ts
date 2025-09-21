// deno-lint-ignore-file no-explicit-any

/** Basic primitives that are renderable directly */
export type BasicTypes = string | bigint | number | boolean

/** Valid child objects of an Element */
export type RenderableElements = BasicTypes | HTMLElement | RenderableElements[] | null | undefined

/** Type used to represent that no Attrs are accepted for a FunctionComponent */
export type EmptyAttrs = Record<string | number | symbol, never>

/** Type used to represent pass-through id to an underlying Element of a Component */
export type IdAttr = {
    /** An id to pass-through to the underlying Element of this Component */
    id?: string
}

/** Type used to represent that children are accepted by a Component */
export type ChildrenAttr = {
    /** A collection of RenderableElements to place as children of this Component */
    children?: RenderableElements
}

/** Type used to represent pass-through style controls by a Component to an underlying Element */
export type StylePassthroughAttrs = {
    /** A string of CSS class names to pass-through to the underlying Element of this Component */
    class?: string
    /** CSS styles to pass-through to the underlying Element of this Component */
    style?: any
}

/**
 * Appends children to an HTMLElement (unwraps Arrays and wraps BasicTypes in TextNodes)
 * 
 * @param parent HTMLElement to append to
 * @param child Children to append
 */
function appendChild(parent: HTMLElement, child: RenderableElements): void {
    if (Array.isArray(child)) {
        // Recurse over arrays
        for (let i = 0; i < child.length; i++) {
            appendChild(parent, child[i])
        }
    } else {
        let element: Text | HTMLElement | undefined = undefined
        if (typeof child === 'string' || typeof child === 'bigint' || typeof child === 'number' || typeof child === 'boolean') {
            // BasicTypes get converted into TextNodes
            element = document.createTextNode(child.toString())
        } else if (child instanceof HTMLElement) {
            element = child
        }
        // If we were able to resolve the element, then append it to the parent
        if (element) {
            parent.appendChild(element)
        }
    }
}

/**
 * A Velotype Function Component that can be used in .tsx files to render HTML Components.
 */
export type FunctionComponent<AttrsType> = (attrs: Readonly<AttrsType>, children: RenderableElements[]) => RenderableElements

/**
 * Sets attributes on an element
 * 
 * Resolves: eventListeners, style object, and processes boolean values
 * 
 * eventListeners support \<div onClick:{()=>{alert()}} />
 * 
 * Boolean values are set as empty attributes when true and unset when false
 */
function setAttrsOnElement(element: HTMLElement, attrs: Readonly<any>): void {
    for (const [name, value] of Object.entries(attrs || {})) {
        if (name.startsWith('on') && name.toLowerCase() in window) {
            // Special handling for event listener attributes
            // Example attrs: {onClick: ()=>{}}
            element.addEventListener(name.toLowerCase().substring(2) as keyof HTMLElementEventMap, value as (this: HTMLElement, ev: Event | UIEvent | WheelEvent) => any)
        } else if (name == 'style' && value instanceof Object) {
            // Special handling for style object
            for (const key of Object.keys(value)) {
                const keyValue = value[key]
                if (keyValue == null) {
                    element.style[key as any] = ""
                } else {
                    // Note: any is used here because "keyof typeof element.style" clashes with "length" and "parentRule" being readonly
                    element.style[key as any] = keyValue
                }
            }
        } else if (typeof value == 'boolean') {
            // Boolean true gets set to empty string, boolean false does not get set
            if (value) {
                element.setAttribute(name, "")
            }
        } else if (value || value == "") {
            // Regular string-based attribute
            element.setAttribute(name, value.toString())
        }
    }
}

/**
 * Short style `createElement()`
 * 
 * Create an element with a tag, set it's attributes using attrs, then append children
 * 
 * ```tsx
 * <tag attrOne={} attrTwo={}>{children}</tag>
 * ```
 */
export function h(tag: FunctionComponent<any> | string, attrs: Readonly<any> | null, ...children: RenderableElements[]): any {
    const notNullAttrs = attrs || {}
    if (typeof tag === 'string') {
        // Base HTML Element
        const element = document.createElement(tag)
        setAttrsOnElement(element, notNullAttrs)
        // Append children
        appendChild(element, children)
        return element
    } else if (typeof tag === 'function') {
        // Function Component
        return (tag as FunctionComponent<any>)(notNullAttrs, children)
    }

    // Fallback case
    console.error('Invalid', tag, notNullAttrs, children)
    return h('div',{style:'display:none;'})
}

/**
 * createElement is a required fallback name in the jsx-runtime transform
 */
export {h as createElement}

/**
 * Short style `createFragment()`
 * 
 * Create a fragment `<></>` (which just propagates an array of `children[]`)
 */
export function f(_attrs: Readonly<any> | null, ...children:  RenderableElements[]): RenderableElements[] {
    return children
}

/** Basic JSX types */
export declare namespace h {
    /** JSX namespace */
    export namespace JSX {
        /** JSX types for elements and their accepted attributes, in Micro just set to any */
        interface IntrinsicElements {
            /** Allow all attributes for all elements */
            [elementName: string]: any
        }
    }
}
