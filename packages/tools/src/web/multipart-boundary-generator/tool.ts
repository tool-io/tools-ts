import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

// Method reference: https://www.rfc-editor.org/rfc/rfc2046.html#section-5.1.1
export type MultipartBoundaryGeneratorInput = {
  readonly entropyBytes: readonly number[];
  readonly body: string;
};
export type MultipartBoundaryGeneratorOutput = {
  readonly boundary: string;
  readonly collides: boolean;
};
export const multipartBoundaryGeneratorInputSchema = {"type":"object","additionalProperties":false,"properties":{"entropyBytes":{"type":"array","items":{"type":"integer","minimum":0,"maximum":255},"minItems":8,"maxItems":24,"description":"Explicit entropy bytes supplied by the caller."},"body":{"type":"string","maxLength":1000000,"description":"Body text to check for boundary collisions."}},"required":["entropyBytes","body"]} as const satisfies ToolJsonSchema;
export const multipartBoundaryGeneratorOutputSchema = {"type":"object","additionalProperties":false,"properties":{"boundary":{"type":"string","maxLength":1000000,"description":"ASCII multipart boundary."},"collides":{"type":"boolean","description":"Whether a delimiter line containing the boundary occurs in the body."}},"required":["boundary","collides"]} as const satisfies ToolJsonSchema;
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const fail = (field: string, message: string, code = "invalid_value"): ToolResult<never> =>
  invalidInput([{code, field, message}]);

export const calculateMultipartBoundaryGenerator = (input: unknown): ToolResult<MultipartBoundaryGeneratorOutput> => {
  if (!isRecord(input))
    return fail("", "Input must be an object.", "object_required");
  const values: Readonly<Record<string, unknown>> = input;
  const schemas: Readonly<Record<string, ToolJsonSchema>> = multipartBoundaryGeneratorInputSchema.properties;
  for (const key of Object.keys(input))
    if (!Object.hasOwn(schemas, key)) return fail(key, "This input field is not supported.", "unknown_field");
  if (!matchesToolJsonSchema(input, multipartBoundaryGeneratorInputSchema)) {
    for (const [field, schema] of Object.entries(schemas))
      if ((["entropyBytes","body"].includes(field) || Object.hasOwn(input, field)) &&
          !matchesToolJsonSchema(Reflect.get(input, field), schema))
        return fail(field, "Provide a value matching the field's schema.", "invalid_field");
    return fail("", "Input does not match the declared schema.", "invalid_input");
  }
  const x: MultipartBoundaryGeneratorInput = {
    entropyBytes: values.entropyBytes as readonly number[],
    body: values.body as string
  };
  const boundary="toolio-"+x.entropyBytes.map(byte=>byte.toString(16).padStart(2,"0")).join("");
  const collides=x.body.split(/\r\n|\n|\r/).some(line=>line.startsWith("--"+boundary));
  const output: MultipartBoundaryGeneratorOutput = {boundary,collides};
  if (!matchesToolJsonSchema(output, multipartBoundaryGeneratorOutputSchema))
    return fail("", "The result cannot be represented by the output schema.", "invalid_output");
  return toolSuccess(output);
};
export const multipartBoundaryGeneratorTool = defineTool<MultipartBoundaryGeneratorInput, MultipartBoundaryGeneratorOutput>({
  id: "web/multipart-boundary-generator", title: "Multipart Boundary Generator", description: "Generate a reproducible multipart boundary from explicit byte values and detect collisions with supplied body text.", contractVersion: 1,
  execution: {kind: "pure"}, execute: calculateMultipartBoundaryGenerator,
  inputSchema: multipartBoundaryGeneratorInputSchema, outputSchema: multipartBoundaryGeneratorOutputSchema,
  ports: {inputs: [{"id":"entropyBytes","label":"Explicit entropy bytes supplied by the caller","description":"Explicit entropy bytes supplied by the caller.","valueType":{"type":"list","items":{"type":"integer"}},"required":true},{"id":"body","label":"Body text to check for boundary collisions","description":"Body text to check for boundary collisions.","valueType":{"type":"string"},"required":true}], outputs: [{"id":"boundary","label":"ASCII multipart boundary","description":"ASCII multipart boundary.","valueType":{"type":"string"}},{"id":"collides","label":"Whether a delimiter line containing the boundary occurs in the body","description":"Whether a delimiter line containing the boundary occurs in the body.","valueType":{"type":"boolean"}}]},
});
export const runMultipartBoundaryGenerator = multipartBoundaryGeneratorTool.execute;
export const example = {"input":{"entropyBytes":[1,35,69,103,137,171,205,239],"body":"Content for upload"},"output":{"boundary":"toolio-0123456789abcdef","collides":false}} satisfies ToolExample<MultipartBoundaryGeneratorInput, MultipartBoundaryGeneratorOutput>;
export default multipartBoundaryGeneratorTool;
