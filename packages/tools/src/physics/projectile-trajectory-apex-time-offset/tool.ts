import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly verticalVelocity: number;
  readonly gravity: number;
  readonly currentTime: number;
};
export type Output = {
  readonly apexTime: number;
  readonly timeUntilApex: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    verticalVelocity: { type: "number" },
    gravity: { type: "number", exclusiveMinimum: 0 },
    currentTime: { type: "number" },
  },
  required: ["verticalVelocity", "gravity", "currentTime"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    apexTime: { type: "number" },
    timeUntilApex: { type: "number" },
  },
  required: ["apexTime", "timeUntilApex"],
} as const;
/** Calculate projectile trajectory apex time offset from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { verticalVelocity, gravity, currentTime } = request;
  const compute = (): Output => {
    H.positive(gravity);
    const apexTime = verticalVelocity / gravity;
    return { apexTime, timeUntilApex: apexTime - currentTime };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { verticalVelocity: 19.6, gravity: 9.8, currentTime: 1 },
  output: { apexTime: 2, timeUntilApex: 1 },
} satisfies ToolExample<Input, Output>;
export const projectileTrajectoryApexTimeOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "physics/projectile-trajectory-apex-time-offset",
    title: "Projectile Trajectory Apex Time Offset Tool",
    description:
      "Calculate projectile trajectory apex time offset from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        verticalVelocity: { type: "number" },
        gravity: { type: "number", exclusiveMinimum: 0 },
        currentTime: { type: "number" },
      },
      required: ["verticalVelocity", "gravity", "currentTime"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        apexTime: { type: "number" },
        timeUntilApex: { type: "number" },
      },
      required: ["apexTime", "timeUntilApex"],
    },
    ports: {
      inputs: [
        {
          id: "verticalVelocity",
          label: "Vertical Velocity",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "gravity",
          label: "Gravity",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "currentTime",
          label: "Current Time",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "apexTime", label: "Apex Time", valueType: { type: "number" } },
        {
          id: "timeUntilApex",
          label: "Time Until Apex",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = projectileTrajectoryApexTimeOffsetTool.execute;
export default projectileTrajectoryApexTimeOffsetTool;
