import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly t: number };
export type Output = {
  readonly leftSensitivity: number;
  readonly rightSensitivity: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { t: { type: "number" } },
  required: ["t"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    leftSensitivity: { type: "number" },
    rightSensitivity: { type: "number" },
  },
  required: ["leftSensitivity", "rightSensitivity"],
} as const;
/** Compute linear interpolant node value sensitivity from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { t } = input;
  const compute = (): Output => {
    return { leftSensitivity: 1 - t, rightSensitivity: t };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { t: 0.25 },
  output: { leftSensitivity: 0.75, rightSensitivity: 0.25 },
} satisfies ToolExample<Input, Output>;
export const linearInterpolantNodeValueSensitivityTool =
  defineSchemaCalculation<Input, Output>({
    id: "interpolation/linear-interpolant-node-value-sensitivity",
    title: "Linear Interpolant Node Value Sensitivity Tool",
    description:
      "Compute linear interpolant node value sensitivity from explicit bounded inputs.",
    calculate,
    inputSchema,
    outputSchema,
    ports: {
      inputs: [
        { id: "t", label: "T", required: true, valueType: { type: "number" } },
      ],
      outputs: [
        {
          id: "leftSensitivity",
          label: "Left Sensitivity",
          valueType: { type: "number" },
        },
        {
          id: "rightSensitivity",
          label: "Right Sensitivity",
          valueType: { type: "number" },
        },
      ],
    },
  });
export const run = linearInterpolantNodeValueSensitivityTool.execute;
export default linearInterpolantNodeValueSensitivityTool;
