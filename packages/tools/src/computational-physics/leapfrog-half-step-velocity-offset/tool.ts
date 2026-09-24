import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly centerVelocity: number;
  readonly acceleration: number;
  readonly step: number;
};
export type Output = {
  readonly previousHalfVelocity: number;
  readonly nextHalfVelocity: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    centerVelocity: { type: "number" },
    acceleration: { type: "number" },
    step: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["centerVelocity", "acceleration", "step"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    previousHalfVelocity: { type: "number" },
    nextHalfVelocity: { type: "number" },
  },
  required: ["previousHalfVelocity", "nextHalfVelocity"],
} as const;
/** Calculate leapfrog half step velocity offset from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { centerVelocity, acceleration, step } = request;
  const compute = (): Output => {
    H.positive(step);
    return {
      previousHalfVelocity: centerVelocity - (acceleration * step) / 2,
      nextHalfVelocity: centerVelocity + (acceleration * step) / 2,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { centerVelocity: 3, acceleration: 2, step: 0.5 },
  output: { previousHalfVelocity: 2.5, nextHalfVelocity: 3.5 },
} satisfies ToolExample<Input, Output>;
export const leapfrogHalfStepVelocityOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "computational-physics/leapfrog-half-step-velocity-offset",
    title: "Leapfrog Half Step Velocity Offset Tool",
    description:
      "Calculate leapfrog half step velocity offset from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        centerVelocity: { type: "number" },
        acceleration: { type: "number" },
        step: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["centerVelocity", "acceleration", "step"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        previousHalfVelocity: { type: "number" },
        nextHalfVelocity: { type: "number" },
      },
      required: ["previousHalfVelocity", "nextHalfVelocity"],
    },
    ports: {
      inputs: [
        {
          id: "centerVelocity",
          label: "Center Velocity",
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
          id: "step",
          label: "Step",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "previousHalfVelocity",
          label: "Previous Half Velocity",
          valueType: { type: "number" },
        },
        {
          id: "nextHalfVelocity",
          label: "Next Half Velocity",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = leapfrogHalfStepVelocityOffsetTool.execute;
export default leapfrogHalfStepVelocityOffsetTool;
