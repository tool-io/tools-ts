import type { ToolJsonSchema } from "../core/definition.js";
import { calculateRandomItem } from "./item/tool.js";
import type { GeneratorRandom } from "./generator-random.js";
import { calculate as truncate } from "../text/truncate/tool.js";
import {
  parseHtmlStartTag,
  type ParsedHtmlTag,
} from "../html/attribute-parser/tool.js";
import { escapeAttribute } from "../html/void-elements-list-checker/tool.js";
import { simpleError } from "../core/simple.js";

export const text = { type: "string", maxLength: 256 } as const;
export const label = { type: "string", minLength: 1, maxLength: 128 } as const;
export const id = {
  type: "string",
  minLength: 1,
  maxLength: 32,
  pattern: "^[a-z][a-z0-9-]*(?![\\s\\S])",
} as const;
export const bool = { type: "boolean" } as const;
export const number = { type: "number" } as const;
export const integer = (
  minimum = 0,
  maximum = Number.MAX_SAFE_INTEGER,
): ToolJsonSchema => ({ type: "integer", minimum, maximum });
export const list = (
  items: ToolJsonSchema,
  maxItems = 32,
  minItems = 1,
): ToolJsonSchema => ({ type: "array", items, maxItems, minItems });
export const object = (
  properties: Readonly<Record<string, ToolJsonSchema>>,
  required: readonly string[] = Object.keys(properties),
): ToolJsonSchema => ({
  type: "object",
  additionalProperties: false,
  properties,
  required,
});
export const enumeration = (values: readonly string[]): ToolJsonSchema => ({
  type: "string",
  enum: values,
});
export const nullable = (schema: ToolJsonSchema): ToolJsonSchema => ({
  anyOf: [schema, { type: "null" }],
});
export const parsedSchema = object({
  name: text,
  attributes: list(
    object({ name: text, value: { type: "string", maxLength: 2048 } }),
    16,
    0,
  ),
});
export const markup = { type: "string", maxLength: 131072 } as const;
export const choose = <T>(values: readonly T[], random: GeneratorRandom): T => {
  const selected = calculateRandomItem(values, random.unit);
  if (selected === null)
    throw new Error("A validated UI inventory was rejected by random/item.");
  return selected;
};
export const preview = (value: string, limit: number): string => {
  const output = truncate({
    actualText: value,
    actualCodepointLimit: limit,
    actualSuffix: limit === 0 ? "" : "…",
  });
  const shortened = output.result.truncatedText;
  if (typeof shortened !== "string")
    throw new Error("The truncate core returned a non-string preview.");
  return shortened;
};
export const distinct = (values: readonly string[], field: string): void => {
  if (new Set(values).size !== values.length)
    return simpleError(field, "IDs must be distinct.", "duplicate_entries");
};
export const work = (
  count: number,
  width: number,
  field: string,
  limit = 1024,
): void => {
  if (count * width > limit)
    return simpleError(
      field,
      "The requested state history exceeds its cell budget.",
      "resource_limit",
    );
};
export const finite = (value: number, field: string): number => {
  if (!Number.isFinite(value))
    return simpleError(
      field,
      "Arithmetic must remain finite.",
      "nonfinite_arithmetic",
    );
  return value === 0 ? 0 : value;
};
export const escape = escapeAttribute;
export const parse = (tag: string): ParsedHtmlTag => {
  const parsed = parseHtmlStartTag(tag);
  if (parsed === null)
    throw new Error("Constructed UI fixture start tag failed lexical parsing.");
  return parsed;
};
export const finish = <T>(output: T): T => {
  if (JSON.stringify(output).length > 1048576)
    throw new Error("UI fixture exceeded the preflighted JSON output budget.");
  return output;
};
