import type {
  ToolExecutionContext,
  ToolJsonSchema,
} from "../core/definition.js";
import { modelInputIssues } from "../core/model-definition.js";
import { invalidInput, toolSuccess, type ToolResult } from "../core/result.js";
import { simpleError } from "../core/simple.js";
import { calculateWordWrap } from "../text/word-wrap/tool.js";
import { runChunk } from "../list/chunk/tool.js";
import { calculateRandomItem } from "./item/tool.js";
import {
  createGeneratorRandom,
  generatorFailure,
  generatorReplay,
  generatorReplaySchema,
  generatorSeedSchema,
  type GeneratorRandom,
  type GeneratorReplay,
} from "./generator-random.js";

export {
  createModelDefinition,
  matchesModelInput,
} from "../core/model-definition.js";
export { simpleError } from "../core/simple.js";
export type {
  ToolExecutionContext,
  ToolJsonSchema,
} from "../core/definition.js";
export type { ToolExample } from "../core/example.js";
export type { ToolResult } from "../core/result.js";
export type NSeed = { readonly seed?: number };
export type NReplay = { readonly randomness: GeneratorReplay };
export const nId = {
  type: "string",
  minLength: 1,
  maxLength: 64,
  pattern: "^[a-zA-Z0-9][a-zA-Z0-9_-]*(?![\\s\\S])",
} as const;
export const nText = {
  type: "string",
  minLength: 1,
  maxLength: 1024,
  pattern: "\\S",
} as const;
export const nBool = { type: "boolean" } as const;
export const nInt = (
  minimum = 0,
  maximum = Number.MAX_SAFE_INTEGER,
): ToolJsonSchema => ({ type: "integer", minimum, maximum });
export const nArray = (
  items: ToolJsonSchema,
  maximum = 32,
  minimum = 0,
): ToolJsonSchema => ({
  type: "array",
  items,
  maxItems: maximum,
  minItems: minimum,
});
export const nObject = (
  properties: Readonly<Record<string, ToolJsonSchema>>,
  required: readonly string[] = Object.keys(properties),
): ToolJsonSchema => ({
  type: "object",
  additionalProperties: false,
  properties,
  required,
});
export const nInput = (
  properties: Readonly<Record<string, ToolJsonSchema>>,
): ToolJsonSchema =>
  nObject(
    { ...properties, seed: generatorSeedSchema },
    Object.keys(properties),
  );
export const nOutput = (
  properties: Readonly<Record<string, ToolJsonSchema>>,
): ToolJsonSchema =>
  nObject({ ...properties, randomness: generatorReplaySchema });
export const nTags = nArray(nId, 16);
export const nWidth = nInt(1, 4096);
export const nStringList = nArray(nText, 16, 1);
export const nWrapped = nObject({
  text: { type: "string", maxLength: 65536 },
  lineCount: nInt(),
});
export type NWrapped = { readonly text: string; readonly lineCount: number };
export const nWrap = (text: string, width: number): NWrapped => {
  if (text.length > 65536)
    return simpleError(
      "text",
      "Expanded text exceeds 65,536 code units.",
      "resource_limit_exceeded",
    );
  const result = calculateWordWrap({ text, width });
  return { text: result.wrappedText, lineCount: result.lineCount };
};
export const nDistinct = (values: readonly string[], field: string): void => {
  if (new Set(values).size !== values.length)
    simpleError(
      field,
      "Entries must have distinct identities.",
      "duplicate_entries",
    );
};
export const nRefs = (
  references: readonly string[],
  ids: readonly string[],
  field: string,
): void => {
  nDistinct(references, field);
  if (references.some((id) => !ids.includes(id)))
    simpleError(
      field,
      "References must name supplied IDs.",
      "invalid_reference",
    );
};
export const nAt = <T>(values: readonly T[], index: number): T => {
  const value = values[index];
  if (value === undefined)
    throw new Error("Internal narrative index is out of range.");
  return value;
};
/** Always pass the one checked advancing source to the legacy item core. */
export const nPick = <T>(values: readonly T[], random: GeneratorRandom): T => {
  if (!values.length)
    return simpleError(
      "candidates",
      "No eligible supplied candidate.",
      "empty_candidates",
    );
  const result = calculateRandomItem(values, random.unit);
  if (result === null) throw new Error("Validated item selection failed.");
  return result;
};
/** Sequential draws without replacement; even the last singleton consumes a draw. */
export const nSample = <T>(
  values: readonly T[],
  count: number,
  random: GeneratorRandom,
): T[] => {
  if (!Number.isSafeInteger(count) || count < 0 || count > values.length)
    return simpleError(
      "count",
      "Count exceeds distinct supplied candidates.",
      "infeasible_count",
    );
  const left = [...values],
    selected: T[] = [];
  for (let i = 0; i < count; i += 1) {
    const value = nPick(left, random);
    selected.push(value);
    left.splice(left.indexOf(value), 1);
  }
  return selected;
};
export const nGroups = <T>(values: readonly T[], size: number): T[][] => {
  const result = runChunk({ values: values.map((_, i) => String(i)), size });
  if (!result.ok) throw new Error("Validated narrative chunking failed.");
  return result.output.chunks.values.map((row) =>
    row.map((index) => nAt(values, Number(index))),
  );
};
export const nSum = (values: readonly number[], field: string): number => {
  const total = values.reduce((sum, value) => sum + BigInt(value), 0n);
  if (
    total > BigInt(Number.MAX_SAFE_INTEGER) ||
    total < BigInt(Number.MIN_SAFE_INTEGER)
  )
    return simpleError(
      field,
      "Aggregate exceeds safe integer arithmetic.",
      "unsafe_aggregate",
    );
  return Number(total) || 0;
};
export const nWork = (count: number, field: string, maximum = 128): void => {
  if (!Number.isSafeInteger(count) || count < 0 || count > maximum)
    simpleError(
      field,
      "Requested work/output exceeds the model budget.",
      "resource_limit_exceeded",
    );
};
export const nTick = (maximum = 20000): (() => void) => {
  let work = 0;
  return () => {
    if (++work > maximum)
      simpleError(
        "search",
        "Bounded search exhausted; feasibility is undetermined.",
        "search_exhausted",
      );
  };
};
export const nIntersect = (
  left: readonly string[],
  right: readonly string[],
): string[] => left.filter((tag) => right.includes(tag));
export const nExpand = (
  template: string,
  values: ReadonlyMap<string, string>,
  field: string,
): string => {
  if (/[{}]/u.test(template.replace(/\{[^{}]*\}/gu, "")))
    return simpleError(field, "Unbalanced template token.", "invalid_token");
  let projected = template.length;
  for (const match of template.matchAll(/\{([^{}]*)\}/gu)) {
    const value = values.get(match[1] ?? "");
    if (value === undefined)
      return simpleError(field, "Unknown template token.", "invalid_token");
    projected += value.length - match[0].length;
    if (projected > 65536)
      return simpleError(
        field,
        "Expanded text exceeds the text budget.",
        "resource_limit_exceeded",
      );
  }
  const expanded = template.replace(/\{([^{}]*)\}/gu, (_, token: string) => {
    const value = values.get(token);
    if (value === undefined)
      return simpleError(field, "Unknown template token.", "invalid_token");
    return value;
  });
  // Braces in supplied values are legitimate; grammar was checked on the template.
  if (expanded.length > 65536)
    return simpleError(
      field,
      "Expanded text exceeds the text budget.",
      "resource_limit_exceeded",
    );
  return expanded;
};
export const nRun = <Input extends NSeed, Output extends object>(
  input: unknown,
  schema: ToolJsonSchema,
  guard: (value: unknown) => value is Input,
  context: ToolExecutionContext | undefined,
  build: (value: Input, random: GeneratorRandom) => Output,
): ToolResult<Output & NReplay> => {
  if (!guard(input)) return invalidInput(modelInputIssues(input, schema));
  try {
    const output = {
      ...build(input, createGeneratorRandom(input.seed, context)),
      randomness: generatorReplay(input.seed, context),
    };
    const visit = (value: unknown): void => {
      if (
        typeof value === "number" &&
        (!Number.isFinite(value) || Object.is(value, -0))
      )
        throw new Error("Narrative model produced nonportable arithmetic.");
      if (value === undefined)
        throw new Error("Narrative model produced undefined.");
      if (Array.isArray(value)) value.forEach(visit);
      else if (value !== null && typeof value === "object")
        Object.values(value).forEach(visit);
    };
    visit(output);
    // Six bytes/code unit is a conservative escaped-JSON UTF-8 upper bound.
    if (JSON.stringify(output).length * 6 > 1048576)
      return simpleError(
        "output",
        "Output exceeds the conservative 1 MiB JSON budget.",
        "resource_limit_exceeded",
      );
    return toolSuccess(output);
  } catch (error) {
    return generatorFailure(error);
  }
};
