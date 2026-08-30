import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

// Method reference: https://www.yorku.ca/mack/hci1992.html
export type FittsLawMovementTimeInput = {
  readonly distance: number;
  readonly width: number;
  readonly interceptMs: number;
  readonly slopeMsPerBit: number;
};
export type FittsLawMovementTimeOutput = {
  readonly indexOfDifficultyBits: number;
  readonly movementTimeMs: number;
};
export const fittsLawMovementTimeInputSchema = {"type":"object","additionalProperties":false,"properties":{"distance":{"type":"number","minimum":0,"description":"Movement distance in the same units as width."},"width":{"type":"number","exclusiveMinimum":0,"description":"Target width along the movement axis."},"interceptMs":{"type":"number","description":"Fitted intercept a."},"slopeMsPerBit":{"type":"number","description":"Fitted slope b."}},"required":["distance","width","interceptMs","slopeMsPerBit"]} as const satisfies ToolJsonSchema;
export const fittsLawMovementTimeOutputSchema = {"type":"object","additionalProperties":false,"properties":{"indexOfDifficultyBits":{"type":"number","minimum":0,"description":"Shannon index of difficulty."},"movementTimeMs":{"type":"number","minimum":0,"description":"Predicted movement time."}},"required":["indexOfDifficultyBits","movementTimeMs"]} as const satisfies ToolJsonSchema;
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const fail = (field: string, message: string, code = "invalid_value"): ToolResult<never> =>
  invalidInput([{code, field, message}]);

export const calculateFittsLawMovementTime = (input: unknown): ToolResult<FittsLawMovementTimeOutput> => {
  if (!isRecord(input))
    return fail("", "Input must be an object.", "object_required");
  const values: Readonly<Record<string, unknown>> = input;
  const schemas: Readonly<Record<string, ToolJsonSchema>> = fittsLawMovementTimeInputSchema.properties;
  for (const key of Object.keys(input))
    if (!Object.hasOwn(schemas, key)) return fail(key, "This input field is not supported.", "unknown_field");
  if (!matchesToolJsonSchema(input, fittsLawMovementTimeInputSchema)) {
    for (const [field, schema] of Object.entries(schemas))
      if ((["distance","width","interceptMs","slopeMsPerBit"].includes(field) || Object.hasOwn(input, field)) &&
          !matchesToolJsonSchema(Reflect.get(input, field), schema))
        return fail(field, "Provide a value matching the field's schema.", "invalid_field");
    return fail("", "Input does not match the declared schema.", "invalid_input");
  }
  const x: FittsLawMovementTimeInput = {
    distance: values.distance as number,
    width: values.width as number,
    interceptMs: values.interceptMs as number,
    slopeMsPerBit: values.slopeMsPerBit as number
  };
  const ratio = x.distance / x.width;
  const indexOfDifficultyBits = Number.isFinite(ratio) ? Math.log2(1 + ratio) : (Math.log(x.distance) - Math.log(x.width) + Math.log1p(x.width / x.distance)) * Math.LOG2E;
  const movementTimeMs = x.interceptMs + x.slopeMsPerBit * indexOfDifficultyBits;
  if (!Number.isFinite(movementTimeMs) || movementTimeMs < 0) return fail("interceptMs", "Coefficients must give a finite nonnegative prediction.", "invalid_prediction");
  const output: FittsLawMovementTimeOutput = { indexOfDifficultyBits, movementTimeMs };
  if (!matchesToolJsonSchema(output, fittsLawMovementTimeOutputSchema))
    return fail("", "The result cannot be represented by the output schema.", "invalid_output");
  return toolSuccess(output);
};
export const fittsLawMovementTimeTool = defineTool<FittsLawMovementTimeInput, FittsLawMovementTimeOutput>({
  id: "neuroscience/fitts-law-movement-time", title: "Fitts Law Movement Time", description: "Evaluate the Shannon formulation MT = a + b × log2(1 + D/W), using distance and width in the same units and caller-fitted coefficients in milliseconds. Predictions must be nonnegative.", contractVersion: 1,
  execution: {kind: "pure"}, execute: calculateFittsLawMovementTime,
  inputSchema: fittsLawMovementTimeInputSchema, outputSchema: fittsLawMovementTimeOutputSchema,
  ports: {inputs: [{"id":"distance","label":"Movement distance in the same units as width","description":"Movement distance in the same units as width.","valueType":{"type":"number"},"required":true},{"id":"width","label":"Target width along the movement axis","description":"Target width along the movement axis.","valueType":{"type":"number"},"required":true},{"id":"interceptMs","label":"Fitted intercept a","description":"Fitted intercept a.","valueType":{"type":"number","unit":"ms"},"required":true},{"id":"slopeMsPerBit","label":"Fitted slope b","description":"Fitted slope b.","valueType":{"type":"number","unit":"ms/bit"},"required":true}], outputs: [{"id":"indexOfDifficultyBits","label":"Shannon index of difficulty","description":"Shannon index of difficulty.","valueType":{"type":"number","unit":"bit"}},{"id":"movementTimeMs","label":"Predicted movement time","description":"Predicted movement time.","valueType":{"type":"number","unit":"ms"}}]},
});
export const runFittsLawMovementTime = fittsLawMovementTimeTool.execute;
export const example = {"input":{"distance":700,"width":100,"interceptMs":100,"slopeMsPerBit":80},"output":{"indexOfDifficultyBits":3,"movementTimeMs":340}} satisfies ToolExample<FittsLawMovementTimeInput, FittsLawMovementTimeOutput>;
export default fittsLawMovementTimeTool;
