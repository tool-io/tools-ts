import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly left: number; readonly right: number };
export type Output = { readonly gradient: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { left: { type: "number" }, right: { type: "number" } },
  required: ["left", "right"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { gradient: { type: "number" } },
  required: ["gradient"],
} as const;
/** Calculate interpolation cell normalized coordinate gradient from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { left, right } = input;
  const compute = (): Output => {
    H.domain(left < right);
    return { gradient: 1 / (right - left) };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { left: 2, right: 6 },
  output: { gradient: 0.25 },
} satisfies ToolExample<Input, Output>;
export const interpolationCellNormalizedCoordinateGradientTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "interpolation/interpolation-cell-normalized-coordinate-gradient",
      title: "Interpolation Cell Normalized Coordinate Gradient Tool",
      description:
        "Calculate interpolation cell normalized coordinate gradient from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { left: { type: "number" }, right: { type: "number" } },
        required: ["left", "right"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { gradient: { type: "number" } },
        required: ["gradient"],
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
        ],
        outputs: [
          { id: "gradient", label: "Gradient", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = interpolationCellNormalizedCoordinateGradientTool.execute;
export default interpolationCellNormalizedCoordinateGradientTool;
