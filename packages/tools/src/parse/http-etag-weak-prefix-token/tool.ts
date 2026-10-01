import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly token: string };
export type Output = { readonly weak: boolean; readonly opaque: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    weak: { type: "boolean" },
    opaque: { type: "string", maxLength: 8192 },
  },
  required: ["weak", "opaque"],
} as const;
/** Compute http etag weak prefix token from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { token } = input;
  const compute = (): Output => {
    const m = /^(W\/)?"([\x21\x23-\x7e\x80-\xff]*)"(?![\s\S])/.exec(token);
    domain(m);
    return { weak: !!m[1], opaque: m[2] };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { token: 'W/"abc"' },
  output: { weak: true, opaque: "abc" },
} satisfies ToolExample<Input, Output>;
export const httpEtagWeakPrefixTokenTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "parse/http-etag-weak-prefix-token",
  title: "HTTP Etag Weak Prefix Token Tool",
  description:
    "Compute http etag weak prefix token from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "token",
        label: "Token",
        required: true,
        valueType: { type: "string" },
      },
    ],
    outputs: [
      { id: "weak", label: "Weak", valueType: { type: "boolean" } },
      { id: "opaque", label: "Opaque", valueType: { type: "string" } },
    ],
  },
});
export const run = httpEtagWeakPrefixTokenTool.execute;
export default httpEtagWeakPrefixTokenTool;
