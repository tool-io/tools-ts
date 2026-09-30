import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly zeroPolicy: number };
export type Output = { readonly subgradient: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { zeroPolicy: { type: "number" } },
  required: ["zeroPolicy"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { subgradient: { type: "number" } },
  required: ["subgradient"],
} as const;
/** Compute mae subgradient zero policy from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { zeroPolicy } = input;
  const compute = (): Output => {
    domain(zeroPolicy >= -1 && zeroPolicy <= 1);
    return { subgradient: zeroPolicy };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { zeroPolicy: 0 },
  output: { subgradient: 0 },
} satisfies ToolExample<Input, Output>;
export const maeSubgradientZeroPolicyTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "metrics/mae-subgradient-zero-policy",
  title: "Mae Subgradient Zero Policy Tool",
  description:
    "Compute mae subgradient zero policy from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "zeroPolicy",
        label: "Zero Policy",
        required: true,
        valueType: { type: "number" },
      },
    ],
    outputs: [
      {
        id: "subgradient",
        label: "Subgradient",
        valueType: { type: "number" },
      },
    ],
  },
});
export const run = maeSubgradientZeroPolicyTool.execute;
export default maeSubgradientZeroPolicyTool;
