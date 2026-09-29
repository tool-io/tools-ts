import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly f00: number;
  readonly f10: number;
  readonly f01: number;
  readonly f11: number;
};
export type Output = { readonly mixedDifference: number };
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
  properties: { mixedDifference: { type: "number" } },
  required: ["mixedDifference"],
} as const;
/** Compute bilinear cell mixed difference from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { f00, f10, f01, f11 } = input;
  const compute = (): Output => {
    return { mixedDifference: f11 - f10 - f01 + f00 };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { f00: 1, f10: 3, f01: 4, f11: 9 },
  output: { mixedDifference: 3 },
} satisfies ToolExample<Input, Output>;
export const bilinearCellMixedDifferenceTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "interpolation/bilinear-cell-mixed-difference",
  title: "Bilinear Cell Mixed Difference Tool",
  description:
    "Compute bilinear cell mixed difference from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
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
        id: "mixedDifference",
        label: "Mixed Difference",
        valueType: { type: "number" },
      },
    ],
  },
});
export const run = bilinearCellMixedDifferenceTool.execute;
export default bilinearCellMixedDifferenceTool;
