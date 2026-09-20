import type { ToolJsonSchema } from "../core/definition.js";

/** Bounded primitive-entry protocol/configuration fixture schemas. */
export const text = { type: "string", maxLength: 65536 } as const;
export const label = { type: "string", minLength: 1, maxLength: 128 } as const;
export const integer = { type: "integer" } as const;
export const boolean = { type: "boolean" } as const;
export const nullableText = { anyOf: [text, { type: "null" }] } as const;
export const scalar = {
  anyOf: [text, { type: "number" }, boolean, { type: "null" }],
} as const;
export type Scalar = string | number | boolean | null;
export const object = (
  properties: Readonly<Record<string, ToolJsonSchema>>,
  required: readonly string[] = Object.keys(properties),
): ToolJsonSchema => ({
  type: "object",
  additionalProperties: false,
  properties,
  required,
});
export const array = (
  items: ToolJsonSchema,
  maxItems = 32,
  minItems = 0,
): ToolJsonSchema => ({ type: "array", items, minItems, maxItems });
export const choice = (values: readonly string[]): ToolJsonSchema => ({
  type: "string",
  enum: values,
});
export const bounded = (minimum: number, maximum: number): ToolJsonSchema => ({
  type: "integer",
  minimum,
  maximum,
});
export const entrySchema = object({ key: label, value: scalar });
export type Entry = { readonly key: string; readonly value: Scalar };
export const flatSchema = {
  type: "object",
  additionalProperties: scalar,
} as const;
