import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly left: number; readonly right: number };
export type Output = {
  readonly arithmetic: number;
  readonly geometric: number;
  readonly gap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { left: { type: "number" }, right: { type: "number" } },
  required: ["left", "right"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    arithmetic: { type: "number" },
    geometric: { type: "number" },
    gap: { type: "number" },
  },
  required: ["arithmetic", "geometric", "gap"],
} as const;
/** Compute arithmetic geometric mean gap two values from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { left, right } = input;
  const compute = (): Output => {
    domain(left >= 0 && right >= 0);
    const arithmetic = (left + right) / 2,
      geometric = Math.sqrt(left) * Math.sqrt(right);
    return { arithmetic, geometric, gap: arithmetic - geometric };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { left: 1, right: 9 },
  output: { arithmetic: 5, geometric: 3, gap: 2 },
} satisfies ToolExample<Input, Output>;
export const arithmeticGeometricMeanGapTwoValuesTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "statistics/arithmetic-geometric-mean-gap-two-values",
  title: "Arithmetic Geometric Mean Gap Two Values Tool",
  description:
    "Compute arithmetic geometric mean gap two values from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "left",
        label: "Left",
        required: true,
        valueType: { type: "number" },
      },
      {
        id: "right",
        label: "Right",
        required: true,
        valueType: { type: "number" },
      },
    ],
    outputs: [
      { id: "arithmetic", label: "Arithmetic", valueType: { type: "number" } },
      { id: "geometric", label: "Geometric", valueType: { type: "number" } },
      { id: "gap", label: "Gap", valueType: { type: "number" } },
    ],
  },
});
export const run = arithmeticGeometricMeanGapTwoValuesTool.execute;
export default arithmeticGeometricMeanGapTwoValuesTool;
