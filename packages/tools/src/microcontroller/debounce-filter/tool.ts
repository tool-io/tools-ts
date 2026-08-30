import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

// Method reference: https://www.microchip.com/en-us/application-notes/an2805
export type DebounceFilterInput = {
  readonly samples: readonly boolean[];
  readonly initial: boolean;
  readonly requiredSamples: number;
};
export type DebounceFilterOutput = {
  readonly states: readonly boolean[];
};
export const debounceFilterInputSchema = {"type":"object","additionalProperties":false,"properties":{"samples":{"type":"array","items":{"type":"boolean"},"minItems":0,"maxItems":100000,"description":"Chronological digital samples."},"initial":{"type":"boolean","description":"Initial debounced state."},"requiredSamples":{"type":"integer","minimum":1,"maximum":100000,"description":"Consecutive samples required for a state change."}},"required":["samples","initial","requiredSamples"]} as const satisfies ToolJsonSchema;
export const debounceFilterOutputSchema = {"type":"object","additionalProperties":false,"properties":{"states":{"type":"array","items":{"type":"boolean"},"minItems":0,"maxItems":100000,"description":"Debounced state after each sample."}},"required":["states"]} as const satisfies ToolJsonSchema;
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const fail = (field: string, message: string, code = "invalid_value"): ToolResult<never> =>
  invalidInput([{code, field, message}]);

export const calculateDebounceFilter = (input: unknown): ToolResult<DebounceFilterOutput> => {
  if (!isRecord(input))
    return fail("", "Input must be an object.", "object_required");
  const values: Readonly<Record<string, unknown>> = input;
  const schemas: Readonly<Record<string, ToolJsonSchema>> = debounceFilterInputSchema.properties;
  for (const key of Object.keys(input))
    if (!Object.hasOwn(schemas, key)) return fail(key, "This input field is not supported.", "unknown_field");
  if (!matchesToolJsonSchema(input, debounceFilterInputSchema)) {
    for (const [field, schema] of Object.entries(schemas))
      if ((["samples","initial","requiredSamples"].includes(field) || Object.hasOwn(input, field)) &&
          !matchesToolJsonSchema(Reflect.get(input, field), schema))
        return fail(field, "Provide a value matching the field's schema.", "invalid_field");
    return fail("", "Input does not match the declared schema.", "invalid_input");
  }
  const x: DebounceFilterInput = {
    samples: values.samples as readonly boolean[],
    initial: values.initial as boolean,
    requiredSamples: values.requiredSamples as number
  };
  let state=x.initial,count=0,candidate=x.initial;const states:boolean[]=[];
  for(const sample of x.samples){if(sample===state){count=0;candidate=state;}else{if(sample===candidate)count++;else{candidate=sample;count=1;}if(count>=x.requiredSamples){state=candidate;count=0;}}states.push(state);}
  const output: DebounceFilterOutput = {states};
  if (!matchesToolJsonSchema(output, debounceFilterOutputSchema))
    return fail("", "The result cannot be represented by the output schema.", "invalid_output");
  return toolSuccess(output);
};
export const debounceFilterTool = defineTool<DebounceFilterInput, DebounceFilterOutput>({
  id: "microcontroller/debounce-filter", title: "Consecutive Sample Debounce Filter", description: "Simulate a digital debounce filter that changes state only after a caller-selected number of consecutive differing samples.", contractVersion: 1,
  execution: {kind: "pure"}, execute: calculateDebounceFilter,
  inputSchema: debounceFilterInputSchema, outputSchema: debounceFilterOutputSchema,
  ports: {inputs: [{"id":"samples","label":"Chronological digital samples","description":"Chronological digital samples.","valueType":{"type":"list","items":{"type":"boolean"}},"required":true},{"id":"initial","label":"Initial debounced state","description":"Initial debounced state.","valueType":{"type":"boolean"},"required":true},{"id":"requiredSamples","label":"Consecutive samples required for a state change","description":"Consecutive samples required for a state change.","valueType":{"type":"integer"},"required":true}], outputs: [{"id":"states","label":"Debounced state after each sample","description":"Debounced state after each sample.","valueType":{"type":"list","items":{"type":"boolean"}}}]},
});
export const runDebounceFilter = debounceFilterTool.execute;
export const example = {"input":{"samples":[true,false,true,true,true,false,false,false],"initial":false,"requiredSamples":3},"output":{"states":[false,false,false,false,true,true,true,false]}} satisfies ToolExample<DebounceFilterInput, DebounceFilterOutput>;
export default debounceFilterTool;
