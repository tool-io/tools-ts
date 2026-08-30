import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

// Method reference: https://www.sitime.com/company/newsroom/blog/oscillator-aging-and-its-importance-precision-timing
export type CrystalAgingPpmInput = {
  readonly initialFrequencyHz: number;
  readonly agedFrequencyHz: number;
};
export type CrystalAgingPpmOutput = {
  readonly agingPpm: number;
};
export const crystalAgingPpmInputSchema = {"type":"object","additionalProperties":false,"properties":{"initialFrequencyHz":{"type":"number","exclusiveMinimum":0,"description":"Initial measured frequency."},"agedFrequencyHz":{"type":"number","exclusiveMinimum":0,"description":"Frequency measured after aging."}},"required":["initialFrequencyHz","agedFrequencyHz"]} as const satisfies ToolJsonSchema;
export const crystalAgingPpmOutputSchema = {"type":"object","additionalProperties":false,"properties":{"agingPpm":{"type":"number","description":"Signed relative frequency change."}},"required":["agingPpm"]} as const satisfies ToolJsonSchema;
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const fail = (field: string, message: string, code = "invalid_value"): ToolResult<never> =>
  invalidInput([{code, field, message}]);

export const calculateCrystalAgingPpm = (input: unknown): ToolResult<CrystalAgingPpmOutput> => {
  if (!isRecord(input))
    return fail("", "Input must be an object.", "object_required");
  const values: Readonly<Record<string, unknown>> = input;
  const schemas: Readonly<Record<string, ToolJsonSchema>> = crystalAgingPpmInputSchema.properties;
  for (const key of Object.keys(input))
    if (!Object.hasOwn(schemas, key)) return fail(key, "This input field is not supported.", "unknown_field");
  if (!matchesToolJsonSchema(input, crystalAgingPpmInputSchema)) {
    for (const [field, schema] of Object.entries(schemas))
      if ((["initialFrequencyHz","agedFrequencyHz"].includes(field) || Object.hasOwn(input, field)) &&
          !matchesToolJsonSchema(Reflect.get(input, field), schema))
        return fail(field, "Provide a value matching the field's schema.", "invalid_field");
    return fail("", "Input does not match the declared schema.", "invalid_input");
  }
  const x: CrystalAgingPpmInput = {
    initialFrequencyHz: values.initialFrequencyHz as number,
    agedFrequencyHz: values.agedFrequencyHz as number
  };
  const agingPpm = ((x.agedFrequencyHz - x.initialFrequencyHz) / x.initialFrequencyHz) * 1e6;
  const output: CrystalAgingPpmOutput = { agingPpm };
  if (!matchesToolJsonSchema(output, crystalAgingPpmOutputSchema))
    return fail("", "The result cannot be represented by the output schema.", "invalid_output");
  return toolSuccess(output);
};
export const crystalAgingPpmTool = defineTool<CrystalAgingPpmInput, CrystalAgingPpmOutput>({
  id: "electronics/crystal-aging-ppm", title: "Crystal Aging Frequency Change", description: "Calculate signed measured frequency change in ppm relative to the initial frequency: 1e6 × (aged − initial) / initial. Measurements must use the same conditions; this does not predict an aging curve.", contractVersion: 1,
  execution: {kind: "pure"}, execute: calculateCrystalAgingPpm,
  inputSchema: crystalAgingPpmInputSchema, outputSchema: crystalAgingPpmOutputSchema,
  ports: {inputs: [{"id":"initialFrequencyHz","label":"Initial measured frequency","description":"Initial measured frequency.","valueType":{"type":"number","unit":"Hz"},"required":true},{"id":"agedFrequencyHz","label":"Frequency measured after aging","description":"Frequency measured after aging.","valueType":{"type":"number","unit":"Hz"},"required":true}], outputs: [{"id":"agingPpm","label":"Signed relative frequency change","description":"Signed relative frequency change.","valueType":{"type":"number","unit":"ppm"}}]},
});
export const runCrystalAgingPpm = crystalAgingPpmTool.execute;
export const example = {"input":{"initialFrequencyHz":10000000,"agedFrequencyHz":10000020},"output":{"agingPpm":2}} satisfies ToolExample<CrystalAgingPpmInput, CrystalAgingPpmOutput>;
export default crystalAgingPpmTool;
