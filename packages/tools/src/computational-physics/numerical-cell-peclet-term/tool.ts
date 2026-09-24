import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly velocity: number;
  readonly cellWidth: number;
  readonly diffusivity: number;
};
export type Output = {
  readonly signedPeclet: number;
  readonly absolutePeclet: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    velocity: { type: "number" },
    cellWidth: { type: "number", exclusiveMinimum: 0 },
    diffusivity: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["velocity", "cellWidth", "diffusivity"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    signedPeclet: { type: "number" },
    absolutePeclet: { type: "number" },
  },
  required: ["signedPeclet", "absolutePeclet"],
} as const;
/** Use cell Pe=u*dx/D without an additional factor of two; discretization conventions are explicit. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { velocity, cellWidth, diffusivity } = request;
  const compute = (): Output => {
    H.positive(cellWidth);
    H.positive(diffusivity);
    return {
      signedPeclet: (velocity * cellWidth) / diffusivity,
      absolutePeclet: (Math.abs(velocity) * cellWidth) / diffusivity,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { velocity: 2, cellWidth: 0.5, diffusivity: 0.25 },
  output: { signedPeclet: 4, absolutePeclet: 4 },
} satisfies ToolExample<Input, Output>;
export const numericalCellPecletTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "computational-physics/numerical-cell-peclet-term",
    title: "Numerical Cell Peclet Term Tool",
    description:
      "Use cell Pe=u*dx/D without an additional factor of two; discretization conventions are explicit.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        velocity: { type: "number" },
        cellWidth: { type: "number", exclusiveMinimum: 0 },
        diffusivity: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["velocity", "cellWidth", "diffusivity"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        signedPeclet: { type: "number" },
        absolutePeclet: { type: "number" },
      },
      required: ["signedPeclet", "absolutePeclet"],
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
          id: "cellWidth",
          label: "Cell Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "diffusivity",
          label: "Diffusivity",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "signedPeclet",
          label: "Signed Peclet",
          valueType: { type: "number" },
        },
        {
          id: "absolutePeclet",
          label: "Absolute Peclet",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = numericalCellPecletTermTool.execute;
export default numericalCellPecletTermTool;
