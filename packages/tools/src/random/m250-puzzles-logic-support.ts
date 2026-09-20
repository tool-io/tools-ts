import type {
  ToolExecutionContext,
  ToolJsonSchema,
} from "../core/definition.js";
import {
  matchesModelInput,
  modelInputIssues,
} from "../core/model-definition.js";
import { invalidInput, type ToolResult } from "../core/result.js";
import { simpleError } from "../core/simple.js";

/** Validation/serialization support only; puzzle models remain in their own tools. */
export const puzzleValidate = (
  input: unknown,
  schema: ToolJsonSchema,
): void => {
  if (!matchesModelInput(input, schema)) {
    const issue = modelInputIssues(input, schema)[0];
    if (!issue) throw new Error("Schema rejection needs a diagnostic.");
    simpleError(issue.field, issue.message, issue.code);
  }
};
export const puzzleExecutor =
  <I, O>(
    guard: (input: unknown) => input is I,
    schema: ToolJsonSchema,
    calculate: (input: I, context?: ToolExecutionContext) => ToolResult<O>,
  ): ((input: unknown, context?: ToolExecutionContext) => ToolResult<O>) =>
  (input, context) =>
    guard(input)
      ? calculate(input, context)
      : invalidInput(modelInputIssues(input, schema));
export const puzzleDistinct = (
  values: readonly (string | number)[],
  field: string,
): void => {
  if (new Set(values).size !== values.length)
    simpleError(
      field,
      "Entries must be distinct; duplicates are rejected explicitly.",
      "duplicate_entry",
    );
};
export const puzzleUnwrap = <T>(result: ToolResult<T>): T => {
  if (!result.ok)
    throw new Error(
      "A generated value was rejected by its delegated core: " +
        JSON.stringify(result.error),
    );
  return result.output;
};
export const puzzleFreeze = <T>(value: T): T => {
  if (value !== null && typeof value === "object") {
    for (const child of Object.values(value)) puzzleFreeze(child);
    Object.freeze(value);
  }
  return value;
};
export const puzzleInteger = { type: "integer" } as const;
export const puzzleBoolean = { type: "boolean" } as const;
export const puzzleIdentifier = {
  type: "string",
  maxLength: 32,
  pattern: "^(?!(?:true|false)$)[A-Za-z_][A-Za-z0-9_]*$(?![\\s\\S])",
} as const;
export const puzzleWord = {
  type: "string",
  minLength: 1,
  maxLength: 32,
  pattern: "^[a-z]+$(?![\\s\\S])",
} as const;
export const puzzleCount = {
  type: "integer",
  minimum: 1,
  maximum: 64,
} as const;
export const puzzleObject = <
  P extends Readonly<Record<string, ToolJsonSchema>>,
>(
  properties: P,
  required: readonly string[] = Object.keys(properties),
): ToolJsonSchema & { readonly properties: P } => ({
  type: "object",
  additionalProperties: false,
  properties,
  required,
});
export const puzzleArray = (
  items: ToolJsonSchema,
  maxItems: number,
  minItems = 0,
): ToolJsonSchema => ({ type: "array", items, minItems, maxItems });
