import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

// Method reference: https://www.w3.org/TR/appmanifest/#display-member
export type ManifestDisplayValidatorInput = {
  readonly display: string;
};
export type ManifestDisplayValidatorOutput = {
  readonly valid: boolean;
};
export const manifestDisplayValidatorInputSchema = {"type":"object","additionalProperties":false,"properties":{"display":{"type":"string","maxLength":1000000,"description":"Manifest display member."}},"required":["display"]} as const satisfies ToolJsonSchema;
export const manifestDisplayValidatorOutputSchema = {"type":"object","additionalProperties":false,"properties":{"valid":{"type":"boolean","description":"Whether the display value is recognized."}},"required":["valid"]} as const satisfies ToolJsonSchema;
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const fail = (field: string, message: string, code = "invalid_value"): ToolResult<never> =>
  invalidInput([{code, field, message}]);

export const calculateManifestDisplayValidator = (input: unknown): ToolResult<ManifestDisplayValidatorOutput> => {
  if (!isRecord(input))
    return fail("", "Input must be an object.", "object_required");
  const values: Readonly<Record<string, unknown>> = input;
  const schemas: Readonly<Record<string, ToolJsonSchema>> = manifestDisplayValidatorInputSchema.properties;
  for (const key of Object.keys(input))
    if (!Object.hasOwn(schemas, key)) return fail(key, "This input field is not supported.", "unknown_field");
  if (!matchesToolJsonSchema(input, manifestDisplayValidatorInputSchema)) {
    for (const [field, schema] of Object.entries(schemas))
      if ((["display"].includes(field) || Object.hasOwn(input, field)) &&
          !matchesToolJsonSchema(Reflect.get(input, field), schema))
        return fail(field, "Provide a value matching the field's schema.", "invalid_field");
    return fail("", "Input does not match the declared schema.", "invalid_input");
  }
  const x: ManifestDisplayValidatorInput = {
    display: values.display as string
  };
  const output: ManifestDisplayValidatorOutput = {valid:["fullscreen","standalone","minimal-ui","browser"].includes(x.display)};
  if (!matchesToolJsonSchema(output, manifestDisplayValidatorOutputSchema))
    return fail("", "The result cannot be represented by the output schema.", "invalid_output");
  return toolSuccess(output);
};
export const manifestDisplayValidatorTool = defineTool<ManifestDisplayValidatorInput, ManifestDisplayValidatorOutput>({
  id: "web/manifest-display-validator", title: "Manifest Display Validator", description: "Validate a web application manifest display keyword without treating display_override extension values as display values.", contractVersion: 1,
  execution: {kind: "pure"}, execute: calculateManifestDisplayValidator,
  inputSchema: manifestDisplayValidatorInputSchema, outputSchema: manifestDisplayValidatorOutputSchema,
  ports: {inputs: [{"id":"display","label":"Manifest display member","description":"Manifest display member.","valueType":{"type":"string"},"required":true}], outputs: [{"id":"valid","label":"Whether the display value is recognized","description":"Whether the display value is recognized.","valueType":{"type":"boolean"}}]},
});
export const runManifestDisplayValidator = manifestDisplayValidatorTool.execute;
export const example = {"input":{"display":"standalone"},"output":{"valid":true}} satisfies ToolExample<ManifestDisplayValidatorInput, ManifestDisplayValidatorOutput>;
export default manifestDisplayValidatorTool;
