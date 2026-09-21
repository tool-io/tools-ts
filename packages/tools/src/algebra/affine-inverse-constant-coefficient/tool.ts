import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly slope: number; readonly intercept: number };
export type Output = { readonly constant: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { slope: { type: "number" }, intercept: { type: "number" } },
  required: ["slope", "intercept"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { constant: { type: "number" } },
  required: ["constant"],
} as const;
/** Calculate affine inverse constant coefficient from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { slope, intercept } = input;
  const compute = (): Output => {
    H.domain(slope !== 0);
    return { constant: -intercept / slope };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { slope: 2, intercept: 6 },
  output: { constant: -3 },
} satisfies ToolExample<Input, Output>;
export const affineInverseConstantCoefficientTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "algebra/affine-inverse-constant-coefficient",
    title: "Affine Inverse Constant Coefficient Tool",
    description:
      "Calculate affine inverse constant coefficient from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { slope: { type: "number" }, intercept: { type: "number" } },
      required: ["slope", "intercept"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { constant: { type: "number" } },
      required: ["constant"],
    },
    ports: {
      inputs: [
        {
          id: "slope",
          label: "Slope",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "intercept",
          label: "Intercept",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "constant", label: "Constant", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = affineInverseConstantCoefficientTool.execute;
export default affineInverseConstantCoefficientTool;
