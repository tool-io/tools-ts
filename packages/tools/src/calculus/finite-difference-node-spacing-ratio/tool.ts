import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly left: number;
  readonly center: number;
  readonly right: number;
};
export type Output = { readonly ratio: number; readonly symmetric: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    left: { type: "number" },
    center: { type: "number" },
    right: { type: "number" },
  },
  required: ["left", "center", "right"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { ratio: { type: "number" }, symmetric: { type: "boolean" } },
  required: ["ratio", "symmetric"],
} as const;
/** Compute finite difference node spacing ratio from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { left, center, right } = input;
  const compute = (): Output => {
    domain(left < center && center < right);
    const a = center - left,
      b = right - center;
    return { ratio: b / a, symmetric: a === b };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { left: 0, center: 1, right: 3 },
  output: { ratio: 2, symmetric: false },
} satisfies ToolExample<Input, Output>;
export const finiteDifferenceNodeSpacingRatioTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "calculus/finite-difference-node-spacing-ratio",
  title: "Finite Difference Node Spacing Ratio Tool",
  description:
    "Compute finite difference node spacing ratio from explicit bounded inputs.",
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
        id: "center",
        label: "Center",
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
      { id: "ratio", label: "Ratio", valueType: { type: "number" } },
      { id: "symmetric", label: "Symmetric", valueType: { type: "boolean" } },
    ],
  },
});
export const run = finiteDifferenceNodeSpacingRatioTool.execute;
export default finiteDifferenceNodeSpacingRatioTool;
