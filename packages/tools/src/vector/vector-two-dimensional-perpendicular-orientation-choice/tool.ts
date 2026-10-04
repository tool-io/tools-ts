import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly x: number;
  readonly y: number;
  readonly counterclockwise: boolean;
};
export type Output = { readonly x: number; readonly y: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    x: { type: "number" },
    y: { type: "number" },
    counterclockwise: { type: "boolean" },
  },
  required: ["x", "y", "counterclockwise"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { x: { type: "number" }, y: { type: "number" } },
  required: ["x", "y"],
} as const;
/** Calculate vector two dimensional perpendicular orientation choice from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { x, y, counterclockwise } = input;
  const compute = (): Output => {
    return { x: counterclockwise ? -y : y, y: counterclockwise ? x : -x };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { x: 3, y: 4, counterclockwise: true },
  output: { x: -4, y: 3 },
} satisfies ToolExample<Input, Output>;
export const vectorTwoDimensionalPerpendicularOrientationChoiceTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "vector/vector-two-dimensional-perpendicular-orientation-choice",
      title: "Vector Two Dimensional Perpendicular Orientation Choice Tool",
      description:
        "Calculate vector two dimensional perpendicular orientation choice from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          x: { type: "number" },
          y: { type: "number" },
          counterclockwise: { type: "boolean" },
        },
        required: ["x", "y", "counterclockwise"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { x: { type: "number" }, y: { type: "number" } },
        required: ["x", "y"],
      },
      ports: {
        inputs: [
          {
            id: "x",
            label: "X",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "y",
            label: "Y",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "counterclockwise",
            label: "Counterclockwise",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          { id: "x", label: "X", valueType: { type: "number" } },
          { id: "y", label: "Y", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run =
  vectorTwoDimensionalPerpendicularOrientationChoiceTool.execute;
export default vectorTwoDimensionalPerpendicularOrientationChoiceTool;
