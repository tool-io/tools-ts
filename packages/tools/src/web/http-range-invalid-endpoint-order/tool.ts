import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
  decimal,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly first: string; readonly last: string };
export type Output = { readonly valid: boolean; readonly length: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    first: { type: "string", maxLength: 8192 },
    last: { type: "string", maxLength: 8192 },
  },
  required: ["first", "last"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    valid: { type: "boolean" },
    length: { type: "string", maxLength: 8192 },
  },
  required: ["valid", "length"],
} as const;
/** Compute http range invalid endpoint order from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { first, last } = input;
  const compute = (): Output => {
    const a = decimal(first),
      b = decimal(last);
    domain(a >= 0n && b >= 0n);
    return { valid: a <= b, length: a <= b ? (b - a + 1n).toString() : "0" };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { first: "10", last: "19" },
  output: { valid: true, length: "10" },
} satisfies ToolExample<Input, Output>;
export const httpRangeInvalidEndpointOrderTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "web/http-range-invalid-endpoint-order",
  title: "HTTP Range Invalid Endpoint Order Tool",
  description:
    "Compute http range invalid endpoint order from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "first",
        label: "First",
        required: true,
        valueType: { type: "string" },
      },
      {
        id: "last",
        label: "Last",
        required: true,
        valueType: { type: "string" },
      },
    ],
    outputs: [
      { id: "valid", label: "Valid", valueType: { type: "boolean" } },
      { id: "length", label: "Length", valueType: { type: "string" } },
    ],
  },
});
export const run = httpRangeInvalidEndpointOrderTool.execute;
export default httpRangeInvalidEndpointOrderTool;
