import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly strikeRadians: number;
  readonly dipDirectionRadians: number;
  readonly toleranceRadians: number;
};
export type Output = {
  readonly signedRightHandResidual: number;
  readonly satisfiesRightHandRule: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    strikeRadians: { type: "number" },
    dipDirectionRadians: { type: "number" },
    toleranceRadians: { type: "number", minimum: 0 },
  },
  required: ["strikeRadians", "dipDirectionRadians", "toleranceRadians"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    signedRightHandResidual: { type: "number" },
    satisfiesRightHandRule: { type: "boolean" },
  },
  required: ["signedRightHandResidual", "satisfiesRightHandRule"],
} as const;
/** Right-hand strike-to-dip-direction quarter-turn residual in radians; no bedding orientation is measured or selected. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { strikeRadians, dipDirectionRadians, toleranceRadians } = request;
  const compute = (): Output => {
    H.domain(toleranceRadians >= 0 && toleranceRadians <= Math.PI);
    return {
      signedRightHandResidual: Math.atan2(
        Math.sin(dipDirectionRadians - strikeRadians - Math.PI / 2),
        Math.cos(dipDirectionRadians - strikeRadians - Math.PI / 2),
      ),
      satisfiesRightHandRule:
        Math.abs(
          Math.atan2(
            Math.sin(dipDirectionRadians - strikeRadians - Math.PI / 2),
            Math.cos(dipDirectionRadians - strikeRadians - Math.PI / 2),
          ),
        ) <= toleranceRadians,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    strikeRadians: 0,
    dipDirectionRadians: 1.5707963267948966,
    toleranceRadians: 0.01,
  },
  output: { signedRightHandResidual: 0, satisfiesRightHandRule: true },
} satisfies ToolExample<Input, Output>;
export const beddingDipStrikeOrthogonalityCheckTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "earth-science/bedding-dip-strike-orthogonality-check",
    title: "Bedding Dip Strike Orthogonality Check Tool",
    description:
      "Right-hand strike-to-dip-direction quarter-turn residual in radians; no bedding orientation is measured or selected.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        strikeRadians: { type: "number" },
        dipDirectionRadians: { type: "number" },
        toleranceRadians: { type: "number", minimum: 0 },
      },
      required: ["strikeRadians", "dipDirectionRadians", "toleranceRadians"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        signedRightHandResidual: { type: "number" },
        satisfiesRightHandRule: { type: "boolean" },
      },
      required: ["signedRightHandResidual", "satisfiesRightHandRule"],
    },
    ports: {
      inputs: [
        {
          id: "strikeRadians",
          label: "Strike Radians",
          required: true,
          valueType: { type: "number", unit: "rad" },
        },
        {
          id: "dipDirectionRadians",
          label: "Dip Direction Radians",
          required: true,
          valueType: { type: "number", unit: "rad" },
        },
        {
          id: "toleranceRadians",
          label: "Tolerance Radians",
          required: true,
          valueType: { type: "number", unit: "rad" },
        },
      ],
      outputs: [
        {
          id: "signedRightHandResidual",
          label: "Signed Right Hand Residual",
          valueType: { type: "number" },
        },
        {
          id: "satisfiesRightHandRule",
          label: "Satisfies Right Hand Rule",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = beddingDipStrikeOrthogonalityCheckTool.execute;
export default beddingDipStrikeOrthogonalityCheckTool;
