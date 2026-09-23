import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly force: number;
  readonly momentArm: number;
  readonly pennationRadians: number;
};
export type Output = { readonly tendonForce: number; readonly torque: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    force: { type: "number", minimum: 0 },
    momentArm: { type: "number" },
    pennationRadians: { type: "number", minimum: 0 },
  },
  required: ["force", "momentArm", "pennationRadians"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { tendonForce: { type: "number" }, torque: { type: "number" } },
  required: ["tendonForce", "torque"],
} as const;
/** Single force projected along the tendon with a signed supplied moment arm; no muscle-recruitment or clinical inference. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { force, momentArm, pennationRadians } = request;
  const compute = (): Output => {
    H.domain(
      force >= 0 && pennationRadians >= 0 && pennationRadians <= Math.PI / 2,
    );
    return {
      tendonForce: force * Math.cos(pennationRadians),
      torque: force * Math.cos(pennationRadians) * momentArm,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { force: 100, momentArm: 0.05, pennationRadians: 0 },
  output: { tendonForce: 100, torque: 5 },
} satisfies ToolExample<Input, Output>;
export const muscleMomentArmTorqueFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biomechanics/muscle-moment-arm-torque-factor",
    title: "Muscle Moment Arm Torque Factor Tool",
    description:
      "Single force projected along the tendon with a signed supplied moment arm; no muscle-recruitment or clinical inference.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        force: { type: "number", minimum: 0 },
        momentArm: { type: "number" },
        pennationRadians: { type: "number", minimum: 0 },
      },
      required: ["force", "momentArm", "pennationRadians"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        tendonForce: { type: "number" },
        torque: { type: "number" },
      },
      required: ["tendonForce", "torque"],
    },
    ports: {
      inputs: [
        {
          id: "force",
          label: "Force",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "momentArm",
          label: "Moment Arm",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "pennationRadians",
          label: "Pennation Radians",
          required: true,
          valueType: { type: "number", unit: "rad" },
        },
      ],
      outputs: [
        {
          id: "tendonForce",
          label: "Tendon Force",
          valueType: { type: "number" },
        },
        { id: "torque", label: "Torque", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = muscleMomentArmTorqueFactorTool.execute;
export default muscleMomentArmTorqueFactorTool;
