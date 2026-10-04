import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly boundary: string };
export type Output = { readonly parameter: string; readonly quoted: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { boundary: { type: "string", maxLength: 8192 } },
  required: ["boundary"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    parameter: { type: "string", maxLength: 8192 },
    quoted: { type: "boolean" },
  },
  required: ["parameter", "quoted"],
} as const;
/** Compute http contenttype boundary quote policy from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { boundary } = input;
  const compute = (): Output => {
    domain(
      /^[0-9A-Za-z\x27()+_,.\/:=? -]{1,70}(?![\s\S])/.test(boundary) &&
        !boundary.endsWith(" "),
    );
    const quoted = !/^[!#$%&\x27*+.^_`|~0-9A-Za-z-]+(?![\s\S])/.test(boundary);
    return {
      parameter: "boundary=" + (quoted ? '"' + boundary + '"' : boundary),
      quoted,
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { boundary: "a:b" },
  output: { parameter: 'boundary="a:b"', quoted: true },
} satisfies ToolExample<Input, Output>;
export const httpContenttypeBoundaryQuotePolicyTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "web/http-contenttype-boundary-quote-policy",
  title: "HTTP Contenttype Boundary Quote Policy Tool",
  description:
    "Compute http contenttype boundary quote policy from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "boundary",
        label: "Boundary",
        required: true,
        valueType: { type: "string" },
      },
    ],
    outputs: [
      { id: "parameter", label: "Parameter", valueType: { type: "string" } },
      { id: "quoted", label: "Quoted", valueType: { type: "boolean" } },
    ],
  },
});
export const run = httpContenttypeBoundaryQuotePolicyTool.execute;
export default httpContenttypeBoundaryQuotePolicyTool;
