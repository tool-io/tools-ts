import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly value: number;
  readonly edge: number;
  readonly tolerance: number;
  readonly preferUpper: boolean;
};
export type Output = { readonly side: string; readonly snapped: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: { type: "number" },
    edge: { type: "number" },
    tolerance: { type: "number" },
    preferUpper: { type: "boolean" },
  },
  required: ["value", "edge", "tolerance", "preferUpper"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    side: { type: "string", maxLength: 8192 },
    snapped: { type: "boolean" },
  },
  required: ["side", "snapped"],
} as const;
/** Compute histogram bin boundary roundoff policy from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { value, edge, tolerance, preferUpper } = input;
  const compute = (): Output => {
    domain(tolerance >= 0);
    const snapped = Math.abs(value - edge) <= tolerance;
    return {
      side: snapped
        ? preferUpper
          ? "upper"
          : "lower"
        : value < edge
          ? "lower"
          : "upper",
      snapped,
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { value: 1.0001, edge: 1, tolerance: 0.001, preferUpper: false },
  output: { side: "lower", snapped: true },
} satisfies ToolExample<Input, Output>;
export const histogramBinBoundaryRoundoffPolicyTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "statistics/histogram-bin-boundary-roundoff-policy",
  title: "Histogram Bin Boundary Roundoff Policy Tool",
  description:
    "Compute histogram bin boundary roundoff policy from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "value",
        label: "Value",
        required: true,
        valueType: { type: "number" },
      },
      {
        id: "edge",
        label: "Edge",
        required: true,
        valueType: { type: "number" },
      },
      {
        id: "tolerance",
        label: "Tolerance",
        required: true,
        valueType: { type: "number" },
      },
      {
        id: "preferUpper",
        label: "Prefer Upper",
        required: true,
        valueType: { type: "boolean" },
      },
    ],
    outputs: [
      { id: "side", label: "Side", valueType: { type: "string" } },
      { id: "snapped", label: "Snapped", valueType: { type: "boolean" } },
    ],
  },
});
export const run = histogramBinBoundaryRoundoffPolicyTool.execute;
export default histogramBinBoundaryRoundoffPolicyTool;
