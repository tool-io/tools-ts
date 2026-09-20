import {
  validCookieName,
  validCookieValue,
} from "../http/cookie-parser/tool.js";
import { simpleError } from "../core/simple.js";
export type GeneratedCookiePair = {
  readonly name: string;
  readonly value: string;
};
export const generatedCookiePairSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    name: { type: "string", minLength: 1, maxLength: 32 },
    value: { type: "string", maxLength: 64 },
  },
  required: ["name", "value"],
} as const;
export const generatedCookiePools = {
  names: {
    type: "array",
    minItems: 1,
    maxItems: 16,
    items: { type: "string", minLength: 1, maxLength: 32 },
  },
  values: {
    type: "array",
    minItems: 1,
    maxItems: 32,
    items: { type: "string", maxLength: 64 },
  },
} as const;
export const checkGeneratedCookiePools = (
  names: readonly string[],
  values: readonly string[],
): void => {
  if (new Set(names).size !== names.length)
    simpleError("names", "Cookie names must be distinct.", "duplicate_entries");
  // Exact-end ASCII guards also close the old validators' trailing-newline '$' gap.
  if (
    names.some(
      (name) => !/^[\x21-\x7e]+(?![\s\S])/.test(name) || !validCookieName(name),
    )
  )
    simpleError(
      "names",
      "Names must be nonempty ASCII cookie tokens without controls.",
      "invalid_cookie_name",
    );
  if (
    values.some(
      (value) =>
        !/^[\x21-\x7e]*(?![\s\S])/.test(value) || !validCookieValue(value),
    )
  )
    simpleError(
      "values",
      "Values must use supported cookie octets without whitespace, controls, quotes, commas, semicolons or backslashes.",
      "invalid_cookie_value",
    );
};
