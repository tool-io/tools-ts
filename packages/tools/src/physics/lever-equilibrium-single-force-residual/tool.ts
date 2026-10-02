import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly forces: readonly number[];
  readonly signedArms: readonly number[];
};
export type Output = { readonly momentResidual: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    forces: { type: "array", maxItems: 256, items: { type: "number" } },
    signedArms: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["forces", "signedArms"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { momentResidual: { type: "number" } },
  required: ["momentResidual"],
} as const;
/** Sum explicitly signed planar lever moments; arm signs establish the torque convention. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { forces, signedArms } = input;
  const compute = (): Output => {
    H.sameLength(forces, signedArms);
    return { momentResidual: H.dot(forces, signedArms) };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { forces: [10, 5], signedArms: [1, -2] },
  output: { momentResidual: 0 },
} satisfies ToolExample<Input, Output>;
export const leverEquilibriumSingleForceResidualTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "physics/lever-equilibrium-single-force-residual",
      title: "Lever Equilibrium Single Force Residual Tool",
      description:
        "Sum explicitly signed planar lever moments; arm signs establish the torque convention.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          forces: { type: "array", maxItems: 256, items: { type: "number" } },
          signedArms: {
            type: "array",
            maxItems: 256,
            items: { type: "number" },
          },
        },
        required: ["forces", "signedArms"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { momentResidual: { type: "number" } },
        required: ["momentResidual"],
      },
      ports: {
        inputs: [
          {
            id: "forces",
            label: "Forces",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
          },
          {
            id: "signedArms",
            label: "Signed Arms",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
          },
        ],
        outputs: [
          {
            id: "momentResidual",
            label: "Moment Residual",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = leverEquilibriumSingleForceResidualTool.execute;
export default leverEquilibriumSingleForceResidualTool;
