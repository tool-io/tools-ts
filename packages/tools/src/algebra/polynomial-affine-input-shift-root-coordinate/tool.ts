import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly root: number;
  readonly scale: number;
  readonly shift: number;
};
export type Output = { readonly root: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    root: { type: "number" },
    scale: { type: "number" },
    shift: { type: "number" },
  },
  required: ["root", "scale", "shift"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { root: { type: "number" } },
  required: ["root"],
} as const;
/** Compute polynomial affine input shift root coordinate from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { root, scale, shift } = input;
  const compute = (): Output => {
    domain(scale !== 0);
    return { root: (root - shift) / scale };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { root: 7, scale: 2, shift: 3 },
  output: { root: 2 },
} satisfies ToolExample<Input, Output>;
export const polynomialAffineInputShiftRootCoordinateTool =
  defineSchemaCalculation<Input, Output>({
    id: "algebra/polynomial-affine-input-shift-root-coordinate",
    title: "Polynomial Affine Input Shift Root Coordinate Tool",
    description:
      "Compute polynomial affine input shift root coordinate from explicit bounded inputs.",
    calculate,
    inputSchema,
    outputSchema,
    ports: {
      inputs: [
        {
          id: "root",
          label: "Root",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "scale",
          label: "Scale",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "shift",
          label: "Shift",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [{ id: "root", label: "Root", valueType: { type: "number" } }],
    },
  });
export const run = polynomialAffineInputShiftRootCoordinateTool.execute;
export default polynomialAffineInputShiftRootCoordinateTool;
