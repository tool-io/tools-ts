import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly a: number; readonly b: number };
export type Output = { readonly translation: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { a: { type: "number" }, b: { type: "number" } },
  required: ["a", "b"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { translation: { type: "number" } },
  required: ["translation"],
} as const;
/** Calculate depressed cubic shift coordinate from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { a, b } = input;
  const compute = (): Output => {
    H.domain(a !== 0);
    return { translation: -b / (3 * a) };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { a: 2, b: 12 },
  output: { translation: -2 },
} satisfies ToolExample<Input, Output>;
export const depressedCubicShiftCoordinateTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "algebra/depressed-cubic-shift-coordinate",
    title: "Depressed Cubic Shift Coordinate Tool",
    description:
      "Calculate depressed cubic shift coordinate from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { a: { type: "number" }, b: { type: "number" } },
      required: ["a", "b"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { translation: { type: "number" } },
      required: ["translation"],
    },
    ports: {
      inputs: [
        { id: "a", label: "A", required: true, valueType: { type: "number" } },
        { id: "b", label: "B", required: true, valueType: { type: "number" } },
      ],
      outputs: [
        {
          id: "translation",
          label: "Translation",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = depressedCubicShiftCoordinateTool.execute;
export default depressedCubicShiftCoordinateTool;
