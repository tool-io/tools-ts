import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly initialVelocity: number;
  readonly acceleration: number;
  readonly duration: number;
};
export type Output = {
  readonly midpointVelocity: number;
  readonly averageVelocity: number;
  readonly displacement: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    initialVelocity: { type: "number" },
    acceleration: { type: "number" },
    duration: { type: "number", minimum: 0 },
  },
  required: ["initialVelocity", "acceleration", "duration"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    midpointVelocity: { type: "number" },
    averageVelocity: { type: "number" },
    displacement: { type: "number" },
  },
  required: ["midpointVelocity", "averageVelocity", "displacement"],
} as const;
/** Return signed midpoint/average velocity and displacement under one constant-acceleration interval. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { initialVelocity, acceleration, duration } = input;
  const compute = (): Output => {
    H.domain(duration >= 0);
    const midpointVelocity = initialVelocity + (acceleration * duration) / 2;
    return {
      midpointVelocity,
      averageVelocity: midpointVelocity,
      displacement: midpointVelocity * duration,
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { initialVelocity: 2, acceleration: 3, duration: 4 },
  output: { midpointVelocity: 8, averageVelocity: 8, displacement: 32 },
} satisfies ToolExample<Input, Output>;
export const constantAccelerationMidpointSpeedTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "physics/constant-acceleration-midpoint-speed",
    title: "Constant Acceleration Midpoint Speed Tool",
    description:
      "Return signed midpoint/average velocity and displacement under one constant-acceleration interval.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        initialVelocity: { type: "number" },
        acceleration: { type: "number" },
        duration: { type: "number", minimum: 0 },
      },
      required: ["initialVelocity", "acceleration", "duration"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        midpointVelocity: { type: "number" },
        averageVelocity: { type: "number" },
        displacement: { type: "number" },
      },
      required: ["midpointVelocity", "averageVelocity", "displacement"],
    },
    ports: {
      inputs: [
        {
          id: "initialVelocity",
          label: "Initial Velocity",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "acceleration",
          label: "Acceleration",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "duration",
          label: "Duration",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "midpointVelocity",
          label: "Midpoint Velocity",
          valueType: { type: "number" },
        },
        {
          id: "averageVelocity",
          label: "Average Velocity",
          valueType: { type: "number" },
        },
        {
          id: "displacement",
          label: "Displacement",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = constantAccelerationMidpointSpeedTool.execute;
export default constantAccelerationMidpointSpeedTool;
