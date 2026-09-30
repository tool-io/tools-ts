import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly left: number;
  readonly right: number;
  readonly target: number;
};
export type Output = { readonly flat: boolean; readonly consistent: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    left: { type: "number" },
    right: { type: "number" },
    target: { type: "number" },
  },
  required: ["left", "right", "target"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { flat: { type: "boolean" }, consistent: { type: "boolean" } },
  required: ["flat", "consistent"],
} as const;
/** Calculate inverse interpolation flat segment flag from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { left, right, target } = input;
  const compute = (): Output => {
    return {
      flat: left === right,
      consistent: left !== right || target === left,
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { left: 3, right: 3, target: 4 },
  output: { flat: true, consistent: false },
} satisfies ToolExample<Input, Output>;
export const inverseInterpolationFlatSegmentFlagTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "interpolation/inverse-interpolation-flat-segment-flag",
      title: "Inverse Interpolation Flat Segment Flag Tool",
      description:
        "Calculate inverse interpolation flat segment flag from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          left: { type: "number" },
          right: { type: "number" },
          target: { type: "number" },
        },
        required: ["left", "right", "target"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          flat: { type: "boolean" },
          consistent: { type: "boolean" },
        },
        required: ["flat", "consistent"],
      },
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
          {
            id: "target",
            label: "Target",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "flat", label: "Flat", valueType: { type: "boolean" } },
          {
            id: "consistent",
            label: "Consistent",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = inverseInterpolationFlatSegmentFlagTool.execute;
export default inverseInterpolationFlatSegmentFlagTool;
