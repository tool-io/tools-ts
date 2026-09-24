import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly currentPosition: number;
  readonly previousPosition: number;
  readonly acceleration: number;
  readonly step: number;
};
export type Output = { readonly nextPosition: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    currentPosition: { type: "number" },
    previousPosition: { type: "number" },
    acceleration: { type: "number" },
    step: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["currentPosition", "previousPosition", "acceleration", "step"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { nextPosition: { type: "number" } },
  required: ["nextPosition"],
} as const;
/** Position Verlet with constant acceleration over the current time step. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { currentPosition, previousPosition, acceleration, step } = request;
  const compute = (): Output => {
    H.positive(step);
    return {
      nextPosition:
        2 * currentPosition - previousPosition + acceleration * step ** 2,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    currentPosition: 2,
    previousPosition: 1,
    acceleration: 3,
    step: 0.5,
  },
  output: { nextPosition: 3.75 },
} satisfies ToolExample<Input, Output>;
export const verletOnePositionStepTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "computational-physics/verlet-one-position-step",
    title: "Verlet One Position Step Tool",
    description:
      "Position Verlet with constant acceleration over the current time step.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        currentPosition: { type: "number" },
        previousPosition: { type: "number" },
        acceleration: { type: "number" },
        step: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["currentPosition", "previousPosition", "acceleration", "step"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { nextPosition: { type: "number" } },
      required: ["nextPosition"],
    },
    ports: {
      inputs: [
        {
          id: "currentPosition",
          label: "Current Position",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "previousPosition",
          label: "Previous Position",
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
          id: "nextPosition",
          label: "Next Position",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = verletOnePositionStepTool.execute;
export default verletOnePositionStepTool;
