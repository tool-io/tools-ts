import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { utf8Encode } from "../../core/encoding.js";
import {sha256} from "@noble/hashes/sha2.js";
import {sha384,sha512} from "@noble/hashes/sha2.js";
import {encodeBase64Bytes} from "../../http/basic-auth-parser/tool.js";
// Method reference: https://w3c.github.io/webappsec-subresource-integrity/
export type SriHashGeneratorInput = {
  readonly text: string;
  readonly algorithm: "sha256" | "sha384" | "sha512";
};
export type SriHashGeneratorOutput = {
  readonly integrity: string;
};
export const sriHashGeneratorInputSchema = {"type":"object","additionalProperties":false,"properties":{"text":{"type":"string","maxLength":1000000,"description":"Resource content interpreted as UTF-8 text."},"algorithm":{"type":"string","enum":["sha256","sha384","sha512"],"description":"SRI hash algorithm."}},"required":["text","algorithm"]} as const satisfies ToolJsonSchema;
export const sriHashGeneratorOutputSchema = {"type":"object","additionalProperties":false,"properties":{"integrity":{"type":"string","maxLength":1000000,"description":"Algorithm and Base64 digest."}},"required":["integrity"]} as const satisfies ToolJsonSchema;
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const fail = (field: string, message: string, code = "invalid_value"): ToolResult<never> =>
  invalidInput([{code, field, message}]);

export const calculateSriHashGenerator = (input: unknown): ToolResult<SriHashGeneratorOutput> => {
  if (!isRecord(input))
    return fail("", "Input must be an object.", "object_required");
  const values: Readonly<Record<string, unknown>> = input;
  const schemas: Readonly<Record<string, ToolJsonSchema>> = sriHashGeneratorInputSchema.properties;
  for (const key of Object.keys(input))
    if (!Object.hasOwn(schemas, key)) return fail(key, "This input field is not supported.", "unknown_field");
  if (!matchesToolJsonSchema(input, sriHashGeneratorInputSchema)) {
    for (const [field, schema] of Object.entries(schemas))
      if ((["text","algorithm"].includes(field) || Object.hasOwn(input, field)) &&
          !matchesToolJsonSchema(Reflect.get(input, field), schema))
        return fail(field, "Provide a value matching the field's schema.", "invalid_field");
    return fail("", "Input does not match the declared schema.", "invalid_input");
  }
  const x: SriHashGeneratorInput = {
    text: values.text as string,
    algorithm: values.algorithm as "sha256" | "sha384" | "sha512"
  };
  const hash={sha256,sha384,sha512}[x.algorithm];
  const bytes=Array.from(hash(Uint8Array.from(utf8Encode(x.text))));
  const output: SriHashGeneratorOutput = {integrity:`${x.algorithm}-${encodeBase64Bytes(bytes)}`};
  if (!matchesToolJsonSchema(output, sriHashGeneratorOutputSchema))
    return fail("", "The result cannot be represented by the output schema.", "invalid_output");
  return toolSuccess(output);
};
export const sriHashGeneratorTool = defineTool<SriHashGeneratorInput, SriHashGeneratorOutput>({
  id: "web/sri-hash-generator", title: "Subresource Integrity Hash Generator", description: "Hash explicit UTF-8 text with SHA-256, SHA-384, or SHA-512 and emit Base64 Subresource Integrity metadata.", contractVersion: 1,
  execution: {kind: "pure"}, execute: calculateSriHashGenerator,
  inputSchema: sriHashGeneratorInputSchema, outputSchema: sriHashGeneratorOutputSchema,
  ports: {inputs: [{"id":"text","label":"Resource content interpreted as UTF-8 text","description":"Resource content interpreted as UTF-8 text.","valueType":{"type":"string"},"required":true},{"id":"algorithm","label":"SRI hash algorithm","description":"SRI hash algorithm.","valueType":{"type":"string"},"required":true}], outputs: [{"id":"integrity","label":"Algorithm and Base64 digest","description":"Algorithm and Base64 digest.","valueType":{"type":"string"}}]},
});
export const runSriHashGenerator = sriHashGeneratorTool.execute;
export const example = {"input":{"text":"abc","algorithm":"sha256"},"output":{"integrity":"sha256-ungWv48Bz+pBQUDeXa4iI7ADYaOWF3qctBD/YfIAFa0="}} satisfies ToolExample<SriHashGeneratorInput, SriHashGeneratorOutput>;
export default sriHashGeneratorTool;
