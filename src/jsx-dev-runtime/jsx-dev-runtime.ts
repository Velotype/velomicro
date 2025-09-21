// deno-lint-ignore-file no-explicit-any

import {
    // Engine types
    type BasicTypes,
    type RenderableElements,

    // Core types
    type FunctionComponent,
    type EmptyAttrs,
    type IdAttr,
    type ChildrenAttr,
    type StylePassthroughAttrs,

    // TSX integration
    h,
    f,
} from "../tsx-micro/tsx-micro.ts"

export {

    // Engine types
    type BasicTypes,
    type RenderableElements,

    // Core types
    type FunctionComponent,
    type EmptyAttrs,
    type IdAttr,
    type ChildrenAttr,
    type StylePassthroughAttrs,

    // TSX integration
    h,
    f,
}

/**
 * Represents the Source passed to jsxDEV on element creation
 */
export type Source = {
    /** The originating file name */
    fileName: string,
    /** The originating line number */
    lineNumber: number,
    /** The originating column number */
    columnNumber: number
}

/**
 * Create an element with a tag, set it's attributes using attrs, then append children
 * 
 * ```tsx
 * <tag attrOne={} attrTwo={}>{children}</tag>
 * ```
 */
export function jsxDEV(tag: any, attrs: any, key: string | undefined, _isStaticChildren: boolean, source: Source, _parent: any): RenderableElements {
    // Pull children out of attrs
    const children = attrs.children
    delete attrs.children

    // Reattach key into attrs if defined
    if (key !== undefined) {
        attrs.key = key
    }

    // Stash source metadata into attrs
    attrs.__vt_source_fileName = source.fileName
    attrs.__vt_source_lineNumber = source.lineNumber
    attrs.__vt_source_columnNumber = source.columnNumber

    return h(tag, attrs, children)
}

/**
 * Create an fragment `<></>` (which just propagates an array of children[])
 */
export const Fragment: (_attrs: Readonly<any> | null, ...children: RenderableElements[]) => RenderableElements[] = f

// Export the JSX namespace for JSX type checking
import type { JSXInternal } from "../jsx-types/jsx-types.d.ts"
export type { JSXInternal as JSX }
