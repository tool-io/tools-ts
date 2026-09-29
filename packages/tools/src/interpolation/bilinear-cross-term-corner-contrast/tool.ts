import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly f00: number;
  readonly f10: number;
  readonly f01: number;
  readonly f11: number;
};
export type Output = { readonly crossCoefficient: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    f00: { type: "number" },
    f10: { type: "number" },
    f01: { type: "number" },
    f11: { type: "number" },
  },
  required: ["f00", "f10", "f01", "f11"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { crossCoefficient: { type: "number" } },
  required: ["crossCoefficient"],
} as const;
/** Calculate bilinear cross term corner contrast from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { f00, f10, f01, f11 } = input;
  const compute = (): Output => {
    return { crossCoefficient: f11 - f10 - f01 + f00 };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { f00: 1, f10: 2, f01: 3, f11: 8 },
  output: { crossCoefficient: 4 },
} satisfies ToolExample<Input, Output>;
export const bilinearCrossTermCornerContrastTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "interpolation/bilinear-cross-term-corner-contrast",
    title: "Bilinear Cross Term Corner Contrast Tool",
    description:
      "Calculate bilinear cross term corner contrast from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        f00: { type: "number" },
        f10: { type: "number" },
        f01: { type: "number" },
        f11: { type: "number" },
      },
      required: ["f00", "f10", "f01", "f11"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { crossCoefficient: { type: "number" } },
      required: ["crossCoefficient"],
    },
    ports: {
      inputs: [
        {
          id: "f00",
          label: "F00",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "f10",
          label: "F10",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "f01",
          label: "F01",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "f11",
          label: "F11",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "crossCoefficient",
          label: "Cross Coefficient",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = bilinearCrossTermCornerContrastTool.execute;
export default bilinearCrossTermCornerContrastTool;
