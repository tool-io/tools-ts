import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly force: number;
  readonly leverArm: number;
  readonly angleRadians: number;
  readonly opposingMoment: number;
};
export type Output = {
  readonly appliedMoment: number;
  readonly netMoment: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    force: { type: "number", minimum: 0 },
    leverArm: { type: "number" },
    angleRadians: { type: "number" },
    opposingMoment: { type: "number" },
  },
  required: ["force", "leverArm", "angleRadians", "opposingMoment"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    appliedMoment: { type: "number" },
    netMoment: { type: "number" },
  },
  required: ["appliedMoment", "netMoment"],
} as const;
/** Compute planar phantom force-arm moment with an explicit opposing moment. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { force, leverArm, angleRadians, opposingMoment } = request;
  const compute = (): Output => {
    H.domain(force >= 0 && leverArm >= 0, "force");
    return {
      appliedMoment: force * leverArm * Math.sin(angleRadians),
      netMoment: force * leverArm * Math.sin(angleRadians) - opposingMoment,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    force: 100,
    leverArm: 0.2,
    angleRadians: 1.5707963267948966,
    opposingMoment: 5,
  },
  output: { appliedMoment: 20, netMoment: 15 },
} satisfies ToolExample<Input, Output>;
export const jointPhantomMomentArmForceTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "rheumatology/joint-phantom-moment-arm-force-term",
    title: "Joint Phantom Moment Arm Force Term Tool",
    description:
      "Compute planar phantom force-arm moment with an explicit opposing moment.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        force: { type: "number", minimum: 0 },
        leverArm: { type: "number" },
        angleRadians: { type: "number" },
        opposingMoment: { type: "number" },
      },
      required: ["force", "leverArm", "angleRadians", "opposingMoment"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        appliedMoment: { type: "number" },
        netMoment: { type: "number" },
      },
      required: ["appliedMoment", "netMoment"],
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
          id: "leverArm",
          label: "Lever Arm",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "angleRadians",
          label: "Angle Radians",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "opposingMoment",
          label: "Opposing Moment",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "appliedMoment",
          label: "Applied Moment",
          valueType: { type: "number" },
        },
        { id: "netMoment", label: "Net Moment", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = jointPhantomMomentArmForceTermTool.execute;
export default jointPhantomMomentArmForceTermTool;
