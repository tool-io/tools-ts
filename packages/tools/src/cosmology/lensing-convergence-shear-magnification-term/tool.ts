import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly convergence: number;
  readonly shearFirst: number;
  readonly shearSecond: number;
};
export type Output = {
  readonly jacobianDeterminant: number;
  readonly signedMagnification: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    convergence: { type: "number" },
    shearFirst: { type: "number" },
    shearSecond: { type: "number" },
  },
  required: ["convergence", "shearFirst", "shearSecond"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    jacobianDeterminant: { type: "number" },
    signedMagnification: { type: "number" },
  },
  required: ["jacobianDeterminant", "signedMagnification"],
} as const;
/** Local signed gravitational-lensing magnification; negative determinant retains image parity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { convergence, shearFirst, shearSecond } = request;
  const compute = (): Output => {
    H.domain((1 - convergence) ** 2 - shearFirst ** 2 - shearSecond ** 2 !== 0);
    return {
      jacobianDeterminant:
        (1 - convergence) ** 2 - shearFirst ** 2 - shearSecond ** 2,
      signedMagnification:
        1 / ((1 - convergence) ** 2 - shearFirst ** 2 - shearSecond ** 2),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { convergence: 0.5, shearFirst: 0, shearSecond: 0 },
  output: { jacobianDeterminant: 0.25, signedMagnification: 4 },
} satisfies ToolExample<Input, Output>;
export const lensingConvergenceShearMagnificationTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "cosmology/lensing-convergence-shear-magnification-term",
      title: "Lensing Convergence Shear Magnification Term Tool",
      description:
        "Local signed gravitational-lensing magnification; negative determinant retains image parity.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          convergence: { type: "number" },
          shearFirst: { type: "number" },
          shearSecond: { type: "number" },
        },
        required: ["convergence", "shearFirst", "shearSecond"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          jacobianDeterminant: { type: "number" },
          signedMagnification: { type: "number" },
        },
        required: ["jacobianDeterminant", "signedMagnification"],
      },
      ports: {
        inputs: [
          {
            id: "convergence",
            label: "Convergence",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "shearFirst",
            label: "Shear First",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "shearSecond",
            label: "Shear Second",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "jacobianDeterminant",
            label: "Jacobian Determinant",
            valueType: { type: "number" },
          },
          {
            id: "signedMagnification",
            label: "Signed Magnification",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = lensingConvergenceShearMagnificationTermTool.execute;
export default lensingConvergenceShearMagnificationTermTool;
