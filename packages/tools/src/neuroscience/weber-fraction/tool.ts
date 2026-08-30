import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

// Method reference: https://pubmed.ncbi.nlm.nih.gov/10831375/
export type WeberFractionInput = {
  readonly justNoticeableIncrement: number;
  readonly baselineMagnitude: number;
};
export type WeberFractionOutput = {
  readonly weberFraction: number;
};
export const weberFractionInputSchema = {"type":"object","additionalProperties":false,"properties":{"justNoticeableIncrement":{"type":"number","minimum":0,"description":"Measured just-noticeable increment in linear stimulus units."},"baselineMagnitude":{"type":"number","exclusiveMinimum":0,"description":"Positive baseline stimulus in the same linear units."}},"required":["justNoticeableIncrement","baselineMagnitude"]} as const satisfies ToolJsonSchema;
export const weberFractionOutputSchema = {"type":"object","additionalProperties":false,"properties":{"weberFraction":{"type":"number","minimum":0,"description":"Just-noticeable increment divided by baseline magnitude."}},"required":["weberFraction"]} as const satisfies ToolJsonSchema;
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const fail = (field: string, message: string, code = "invalid_value"): ToolResult<never> =>
  invalidInput([{code, field, message}]);

export const calculateWeberFraction = (input: unknown): ToolResult<WeberFractionOutput> => {
  if (!isRecord(input))
    return fail("", "Input must be an object.", "object_required");
  const values: Readonly<Record<string, unknown>> = input;
  const schemas: Readonly<Record<string, ToolJsonSchema>> = weberFractionInputSchema.properties;
  for (const key of Object.keys(input))
    if (!Object.hasOwn(schemas, key)) return fail(key, "This input field is not supported.", "unknown_field");
  if (!matchesToolJsonSchema(input, weberFractionInputSchema)) {
    for (const [field, schema] of Object.entries(schemas))
      if ((["justNoticeableIncrement","baselineMagnitude"].includes(field) || Object.hasOwn(input, field)) &&
          !matchesToolJsonSchema(Reflect.get(input, field), schema))
        return fail(field, "Provide a value matching the field's schema.", "invalid_field");
    return fail("", "Input does not match the declared schema.", "invalid_input");
  }
  const x: WeberFractionInput = {
    justNoticeableIncrement: values.justNoticeableIncrement as number,
    baselineMagnitude: values.baselineMagnitude as number
  };
  const output: WeberFractionOutput = { weberFraction: x.justNoticeableIncrement / x.baselineMagnitude };
  if (!matchesToolJsonSchema(output, weberFractionOutputSchema))
    return fail("", "The result cannot be represented by the output schema.", "invalid_output");
  return toolSuccess(output);
};
export const weberFractionTool = defineTool<WeberFractionInput, WeberFractionOutput>({
  id: "neuroscience/weber-fraction", title: "Weber Fraction", description: "Calculate the dimensionless Weber fraction as measured just-noticeable increment divided by baseline stimulus magnitude. Both magnitudes must use the same linear units; no universal sensory threshold is assumed.", contractVersion: 1,
  execution: {kind: "pure"}, execute: calculateWeberFraction,
  inputSchema: weberFractionInputSchema, outputSchema: weberFractionOutputSchema,
  ports: {inputs: [{"id":"justNoticeableIncrement","label":"Measured just-noticeable increment in linear stimulus units","description":"Measured just-noticeable increment in linear stimulus units.","valueType":{"type":"number"},"required":true},{"id":"baselineMagnitude","label":"Positive baseline stimulus in the same linear units","description":"Positive baseline stimulus in the same linear units.","valueType":{"type":"number"},"required":true}], outputs: [{"id":"weberFraction","label":"Just-noticeable increment divided by baseline magnitude","description":"Just-noticeable increment divided by baseline magnitude.","valueType":{"type":"number"}}]},
});
export const runWeberFraction = weberFractionTool.execute;
export const example = {"input":{"justNoticeableIncrement":5,"baselineMagnitude":100},"output":{"weberFraction":0.05}} satisfies ToolExample<WeberFractionInput, WeberFractionOutput>;
export default weberFractionTool;
