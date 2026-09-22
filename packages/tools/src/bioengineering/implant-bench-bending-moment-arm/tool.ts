import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly force: number;
  readonly leverArm: number;
  readonly angleRadians: number;
};
export type Output = { readonly moment: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    force: { type: "number", minimum: 0 },
    leverArm: { type: "number", minimum: 0 },
    angleRadians: { type: "number" },
  },
  required: ["force", "leverArm", "angleRadians"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { moment: { type: "number" } },
  required: ["moment"],
} as const;
/** Bench moment magnitude/sign from the angle between lever arm and force; no implant fitness or clinical load limit is inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { force, leverArm, angleRadians } = request;
  const compute = (): Output => {
    H.domain(force >= 0 && leverArm >= 0);
    return { moment: force * leverArm * Math.sin(angleRadians) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { force: 10, leverArm: 2, angleRadians: 1.5707963267948966 },
  output: { moment: 20 },
} satisfies ToolExample<Input, Output>;
export const implantBenchBendingMomentArmTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "bioengineering/implant-bench-bending-moment-arm",
    title: "Implant Bench Bending Moment Arm Tool",
    description:
      "Bench moment magnitude/sign from the angle between lever arm and force; no implant fitness or clinical load limit is inferred.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        force: { type: "number", minimum: 0 },
        leverArm: { type: "number", minimum: 0 },
        angleRadians: { type: "number" },
      },
      required: ["force", "leverArm", "angleRadians"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { moment: { type: "number" } },
      required: ["moment"],
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
          valueType: { type: "number", unit: "rad" },
        },
      ],
      outputs: [
        { id: "moment", label: "Moment", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = implantBenchBendingMomentArmTool.execute;
export default implantBenchBendingMomentArmTool;
