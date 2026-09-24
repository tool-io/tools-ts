import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
  decimal,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly mask: string };
export type Output = { readonly count: number; readonly odd: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { mask: { type: "string", maxLength: 8192 } },
  required: ["mask"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { count: { type: "integer" }, odd: { type: "boolean" } },
  required: ["count", "odd"],
} as const;
/** Compute subset mask cardinality parity from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { mask } = input;
  const compute = (): Output => {
    const n = decimal(mask);
    domain(n >= 0n && n < 1n << 128n);
    const count = [...n.toString(2)].filter((x) => x === "1").length;
    return { count, odd: count % 2 === 1 };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { mask: "13" },
  output: { count: 3, odd: true },
} satisfies ToolExample<Input, Output>;
export const subsetMaskCardinalityParityTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "combinatorics/subset-mask-cardinality-parity",
  title: "Subset Mask Cardinality Parity Tool",
  description:
    "Compute subset mask cardinality parity from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "mask",
        label: "Mask",
        required: true,
        valueType: { type: "string" },
      },
    ],
    outputs: [
      { id: "count", label: "Count", valueType: { type: "integer" } },
      { id: "odd", label: "Odd", valueType: { type: "boolean" } },
    ],
  },
});
export const run = subsetMaskCardinalityParityTool.execute;
export default subsetMaskCardinalityParityTool;
