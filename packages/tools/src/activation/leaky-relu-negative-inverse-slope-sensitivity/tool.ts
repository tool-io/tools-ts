import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly output: number; readonly slope: number };
export type Output = { readonly derivative: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    output: { type: "number", exclusiveMaximum: 0 },
    slope: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["output", "slope"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { derivative: { type: "number" } },
  required: ["derivative"],
} as const;
/** Calculate leaky relu negative inverse slope sensitivity from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { output, slope } = request;
  const compute = (): Output => {
    H.domain(output < 0);
    H.positive(slope);
    return { derivative: -output / (slope * slope) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { output: -2, slope: 0.5 },
  output: { derivative: 8 },
} satisfies ToolExample<Input, Output>;
export const leakyReluNegativeInverseSlopeSensitivityTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "activation/leaky-relu-negative-inverse-slope-sensitivity",
      title: "Leaky ReLU Negative Inverse Slope Sensitivity Tool",
      description:
        "Calculate leaky relu negative inverse slope sensitivity from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          output: { type: "number", exclusiveMaximum: 0 },
          slope: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["output", "slope"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { derivative: { type: "number" } },
        required: ["derivative"],
      },
      ports: {
        inputs: [
          {
            id: "output",
            label: "Output",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "slope",
            label: "Slope",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "derivative",
            label: "Derivative",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = leakyReluNegativeInverseSlopeSensitivityTool.execute;
export default leakyReluNegativeInverseSlopeSensitivityTool;
