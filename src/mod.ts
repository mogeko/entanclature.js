/**
 * A library for Entanglement Nomenclature.
 *
 * @remarks
 * This module exports only one function `entanclature` to handle
 * the Entanglement Nomenclature. `entanclature` accepts a `URL` or
 * file path (Node.js only) as an argument and it always returns a fixed data structure.
 *
 * @packageDocumentation
 */

export { entanclature } from "./core/entrance";

export type { Meta, root, fromFile, fromURL } from "./core/entrance";
export type { Opts, Result } from "./core/entanglement";
export type { Decoded, Encoded, Quality } from "./core/nomenclature";
export type { GRAMMAR, Type, Mark, Ext, ValueOf } from "./core/grammar";
