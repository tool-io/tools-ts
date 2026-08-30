import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

// Method reference: https://web.ics.purdue.edu/~dws/pubs/ProctorSchneider_2018_QJEP.pdf
export type ReactionTimeHickInput = {
  readonly choices: number;
  readonly interceptMs: number;
  readonly slopeMsPerBit: number;
};
export type ReactionTimeHickOutput = {
  readonly informationBits: number;
  readonly reactionTimeMs: number;
};
export const reactionTimeHickInputSchema = {"type":"object","additionalProperties":false,"properties":{"choices":{"type":"integer","minimum":1,"description":"Number of equally likely choices."},"interceptMs":{"type":"number","description":"Fitted intercept a."},"slopeMsPerBit":{"type":"number","description":"Fitted slope b."}},"required":["choices","interceptMs","slopeMsPerBit"]} as const satisfies ToolJsonSchema;
export const reactionTimeHickOutputSchema = {"type":"object","additionalProperties":false,"properties":{"informationBits":{"type":"number","minimum":0,"description":"Choice information log2(n)."},"reactionTimeMs":{"type":"number","minimum":0,"description":"Predicted reaction time."}},"required":["informationBits","reactionTimeMs"]} as const satisfies ToolJsonSchema;
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const fail = (field: string, message: string, code = "invalid_value"): ToolResult<never> =>
  invalidInput([{code, field, message}]);

export const calculateReactionTimeHick = (input: unknown): ToolResult<ReactionTimeHickOutput> => {
  if (!isRecord(input))
    return fail("", "Input must be an object.", "object_required");
  const values: Readonly<Record<string, unknown>> = input;
  const schemas: Readonly<Record<string, ToolJsonSchema>> = reactionTimeHickInputSchema.properties;
  for (const key of Object.keys(input))
    if (!Object.hasOwn(schemas, key)) return fail(key, "This input field is not supported.", "unknown_field");
  if (!matchesToolJsonSchema(input, reactionTimeHickInputSchema)) {
    for (const [field, schema] of Object.entries(schemas))
      if ((["choices","interceptMs","slopeMsPerBit"].includes(field) || Object.hasOwn(input, field)) &&
          !matchesToolJsonSchema(Reflect.get(input, field), schema))
        return fail(field, "Provide a value matching the field's schema.", "invalid_field");
    return fail("", "Input does not match the declared schema.", "invalid_input");
  }
  const x: ReactionTimeHickInput = {
    choices: values.choices as number,
    interceptMs: values.interceptMs as number,
    slopeMsPerBit: values.slopeMsPerBit as number
  };
  const informationBits = Math.log2(x.choices);
  const reactionTimeMs = x.interceptMs + x.slopeMsPerBit * informationBits;
  if (!Number.isFinite(reactionTimeMs) || reactionTimeMs < 0) return fail("interceptMs", "Coefficients must give a finite nonnegative prediction.", "invalid_prediction");
  const output: ReactionTimeHickOutput = { informationBits, reactionTimeMs };
  if (!matchesToolJsonSchema(output, reactionTimeHickOutputSchema))
    return fail("", "The result cannot be represented by the output schema.", "invalid_output");
  return toolSuccess(output);
};
export const reactionTimeHickTool = defineTool<ReactionTimeHickInput, ReactionTimeHickOutput>({
  id: "neuroscience/reaction-time-hick", title: "Hick Choice Reaction Time", description: "Evaluate the equally likely choice form RT = a + b × log2(n), using caller-fitted coefficients in milliseconds. Predictions must be nonnegative; this is a model evaluation without participant calibration.", contractVersion: 1,
  execution: {kind: "pure"}, execute: calculateReactionTimeHick,
  inputSchema: reactionTimeHickInputSchema, outputSchema: reactionTimeHickOutputSchema,
  ports: {inputs: [{"id":"choices","label":"Number of equally likely choices","description":"Number of equally likely choices.","valueType":{"type":"integer"},"required":true},{"id":"interceptMs","label":"Fitted intercept a","description":"Fitted intercept a.","valueType":{"type":"number","unit":"ms"},"required":true},{"id":"slopeMsPerBit","label":"Fitted slope b","description":"Fitted slope b.","valueType":{"type":"number","unit":"ms/bit"},"required":true}], outputs: [{"id":"informationBits","label":"Choice information log2(n)","description":"Choice information log2(n).","valueType":{"type":"number","unit":"bit"}},{"id":"reactionTimeMs","label":"Predicted reaction time","description":"Predicted reaction time.","valueType":{"type":"number","unit":"ms"}}]},
});
export const runReactionTimeHick = reactionTimeHickTool.execute;
export const example = {"input":{"choices":8,"interceptMs":200,"slopeMsPerBit":50},"output":{"informationBits":3,"reactionTimeMs":350}} satisfies ToolExample<ReactionTimeHickInput, ReactionTimeHickOutput>;
export default reactionTimeHickTool;
