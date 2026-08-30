import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

// Method reference: https://pubmed.ncbi.nlm.nih.gov/10831375/
export type JustNoticeableDifferenceInput = {
  readonly weberFraction: number;
  readonly baselineMagnitude: number;
};
export type JustNoticeableDifferenceOutput = {
  readonly justNoticeableIncrement: number;
};
export const justNoticeableDifferenceInputSchema = {"type":"object","additionalProperties":false,"properties":{"weberFraction":{"type":"number","minimum":0,"description":"Task-specific Weber fraction."},"baselineMagnitude":{"type":"number","exclusiveMinimum":0,"description":"Positive baseline in linear stimulus units."}},"required":["weberFraction","baselineMagnitude"]} as const satisfies ToolJsonSchema;
export const justNoticeableDifferenceOutputSchema = {"type":"object","additionalProperties":false,"properties":{"justNoticeableIncrement":{"type":"number","minimum":0,"description":"Predicted increment in the baseline units."}},"required":["justNoticeableIncrement"]} as const satisfies ToolJsonSchema;
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const fail = (field: string, message: string, code = "invalid_value"): ToolResult<never> =>
  invalidInput([{code, field, message}]);

export const calculateJustNoticeableDifference = (input: unknown): ToolResult<JustNoticeableDifferenceOutput> => {
  if (!isRecord(input))
    return fail("", "Input must be an object.", "object_required");
  const values: Readonly<Record<string, unknown>> = input;
  const schemas: Readonly<Record<string, ToolJsonSchema>> = justNoticeableDifferenceInputSchema.properties;
  for (const key of Object.keys(input))
    if (!Object.hasOwn(schemas, key)) return fail(key, "This input field is not supported.", "unknown_field");
  if (!matchesToolJsonSchema(input, justNoticeableDifferenceInputSchema)) {
    for (const [field, schema] of Object.entries(schemas))
      if ((["weberFraction","baselineMagnitude"].includes(field) || Object.hasOwn(input, field)) &&
          !matchesToolJsonSchema(Reflect.get(input, field), schema))
        return fail(field, "Provide a value matching the field's schema.", "invalid_field");
    return fail("", "Input does not match the declared schema.", "invalid_input");
  }
  const x: JustNoticeableDifferenceInput = {
    weberFraction: values.weberFraction as number,
    baselineMagnitude: values.baselineMagnitude as number
  };
  const output: JustNoticeableDifferenceOutput = { justNoticeableIncrement: x.weberFraction * x.baselineMagnitude };
  if (!matchesToolJsonSchema(output, justNoticeableDifferenceOutputSchema))
    return fail("", "The result cannot be represented by the output schema.", "invalid_output");
  return toolSuccess(output);
};
export const justNoticeableDifferenceTool = defineTool<JustNoticeableDifferenceInput, JustNoticeableDifferenceOutput>({
  id: "neuroscience/just-noticeable-difference", title: "Weber Law Just Noticeable Difference", description: "Evaluate Weber law ΔS = k × S from a supplied Weber fraction and positive baseline magnitude in linear units. Applicability of the fraction to the sensory task belongs to the caller.", contractVersion: 1,
  execution: {kind: "pure"}, execute: calculateJustNoticeableDifference,
  inputSchema: justNoticeableDifferenceInputSchema, outputSchema: justNoticeableDifferenceOutputSchema,
  ports: {inputs: [{"id":"weberFraction","label":"Task-specific Weber fraction","description":"Task-specific Weber fraction.","valueType":{"type":"number"},"required":true},{"id":"baselineMagnitude","label":"Positive baseline in linear stimulus units","description":"Positive baseline in linear stimulus units.","valueType":{"type":"number"},"required":true}], outputs: [{"id":"justNoticeableIncrement","label":"Predicted increment in the baseline units","description":"Predicted increment in the baseline units.","valueType":{"type":"number"}}]},
});
export const runJustNoticeableDifference = justNoticeableDifferenceTool.execute;
export const example = {"input":{"weberFraction":0.05,"baselineMagnitude":200},"output":{"justNoticeableIncrement":10}} satisfies ToolExample<JustNoticeableDifferenceInput, JustNoticeableDifferenceOutput>;
export default justNoticeableDifferenceTool;
