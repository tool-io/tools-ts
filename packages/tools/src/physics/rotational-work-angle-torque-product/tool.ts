import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly constantTorqueNewtonMeters: number;
  readonly signedRotationRadians: number;
};
export type Output = { readonly workJoules: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    constantTorqueNewtonMeters: { type: "number" },
    signedRotationRadians: { type: "number" },
  },
  required: ["constantTorqueNewtonMeters", "signedRotationRadians"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { workJoules: { type: "number" } },
  required: ["workJoules"],
} as const;
/** Multiply explicit constant axial torque by compatible signed angular displacement in radians. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { constantTorqueNewtonMeters, signedRotationRadians } = request;
  const compute = (): Output => {
    return { workJoules: constantTorqueNewtonMeters * signedRotationRadians };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { constantTorqueNewtonMeters: 12, signedRotationRadians: 0.5 },
  output: { workJoules: 6 },
} satisfies ToolExample<Input, Output>;
export const rotationalWorkAngleTorqueProductTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["physics"],
      keywords: ["physics"],
    },
    id: "physics/rotational-work-angle-torque-product",
    title: "Rotational Work Angle Torque Product",
    description:
      "Multiply explicit constant axial torque by compatible signed angular displacement in radians.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        constantTorqueNewtonMeters: { type: "number" },
        signedRotationRadians: { type: "number" },
      },
      required: ["constantTorqueNewtonMeters", "signedRotationRadians"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { workJoules: { type: "number" } },
      required: ["workJoules"],
    },
    ports: {
      inputs: [
        {
          id: "constantTorqueNewtonMeters",
          label: "Constant Torque Newton Meters",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "signedRotationRadians",
          label: "Signed Rotation Radians",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "workJoules",
          label: "Work Joules",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = rotationalWorkAngleTorqueProductTool.execute;
export default rotationalWorkAngleTorqueProductTool;
