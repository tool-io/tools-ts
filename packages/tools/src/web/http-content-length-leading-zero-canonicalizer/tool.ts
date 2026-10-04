import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly token: string };
export type Output = { readonly canonical: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { canonical: { type: "string", maxLength: 8192 } },
  required: ["canonical"],
} as const;
/** Compute http content length leading zero canonicalizer from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { token } = input;
  const compute = (): Output => {
    domain(/^\d{1,128}(?![\s\S])/.test(token));
    return { canonical: BigInt(token).toString() };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { token: "000123" },
  output: { canonical: "123" },
} satisfies ToolExample<Input, Output>;
export const httpContentLengthLeadingZeroCanonicalizerTool =
  defineSchemaCalculation<Input, Output>({
    id: "web/http-content-length-leading-zero-canonicalizer",
    title: "HTTP Content Length Leading Zero Canonicalizer Tool",
    description:
      "Compute http content length leading zero canonicalizer from explicit bounded inputs.",
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
        { id: "canonical", label: "Canonical", valueType: { type: "string" } },
      ],
    },
  });
export const run = httpContentLengthLeadingZeroCanonicalizerTool.execute;
export default httpContentLengthLeadingZeroCanonicalizerTool;
