import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly velocity: number;
  readonly timeStep: number;
  readonly spacing: number;
};
export type Output = {
  readonly signedCourant: number;
  readonly magnitude: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    velocity: { type: "number" },
    timeStep: { type: "number", minimum: 0 },
    spacing: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["velocity", "timeStep", "spacing"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    signedCourant: { type: "number" },
    magnitude: { type: "number" },
  },
  required: ["signedCourant", "magnitude"],
} as const;
/** Compute one supplied signed Courant component without assessing stability of an unspecified numerical scheme. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { velocity, timeStep, spacing } = request;
  const compute = (): Output => {
    H.domain(timeStep >= 0);
    H.positive(spacing);
    return {
      signedCourant: (velocity * timeStep) / spacing,
      magnitude: Math.abs((velocity * timeStep) / spacing),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { velocity: 2, timeStep: 0.5, spacing: 4 },
  output: { signedCourant: 0.25, magnitude: 0.25 },
} satisfies ToolExample<Input, Output>;
export const gridCourantComponentTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "computational-physics/grid-courant-component",
    title: "Grid Courant Component Tool",
    description:
      "Compute one supplied signed Courant component without assessing stability of an unspecified numerical scheme.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        velocity: { type: "number" },
        timeStep: { type: "number", minimum: 0 },
        spacing: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["velocity", "timeStep", "spacing"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        signedCourant: { type: "number" },
        magnitude: { type: "number" },
      },
      required: ["signedCourant", "magnitude"],
    },
    ports: {
      inputs: [
        {
          id: "velocity",
          label: "Velocity",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "timeStep",
          label: "Time Step",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "spacing",
          label: "Spacing",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "signedCourant",
          label: "Signed Courant",
          valueType: { type: "number" },
        },
        { id: "magnitude", label: "Magnitude", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = gridCourantComponentTool.execute;
export default gridCourantComponentTool;
