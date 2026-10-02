import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly centroidInertia: number;
  readonly mass: number;
  readonly offset: number;
};
export type Output = {
  readonly increment: number;
  readonly shiftedInertia: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    centroidInertia: { type: "number", minimum: 0 },
    mass: { type: "number", minimum: 0 },
    offset: { type: "number" },
  },
  required: ["centroidInertia", "mass", "offset"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    increment: { type: "number" },
    shiftedInertia: { type: "number" },
  },
  required: ["increment", "shiftedInertia"],
} as const;
/** Apply the parallel-axis theorem to two parallel rotation axes separated by an explicit distance. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { centroidInertia, mass, offset } = input;
  const compute = (): Output => {
    H.domain(centroidInertia >= 0 && mass >= 0);
    const increment = mass * offset * offset;
    return { increment, shiftedInertia: centroidInertia + increment };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { centroidInertia: 2, mass: 3, offset: 2 },
  output: { increment: 12, shiftedInertia: 14 },
} satisfies ToolExample<Input, Output>;
export const inertiaParallelAxisContributionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "physics/inertia-parallel-axis-contribution",
    title: "Inertia Parallel Axis Contribution Tool",
    description:
      "Apply the parallel-axis theorem to two parallel rotation axes separated by an explicit distance.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        centroidInertia: { type: "number", minimum: 0 },
        mass: { type: "number", minimum: 0 },
        offset: { type: "number" },
      },
      required: ["centroidInertia", "mass", "offset"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        increment: { type: "number" },
        shiftedInertia: { type: "number" },
      },
      required: ["increment", "shiftedInertia"],
    },
    ports: {
      inputs: [
        {
          id: "centroidInertia",
          label: "Centroid Inertia",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "mass",
          label: "Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "offset",
          label: "Offset",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "increment", label: "Increment", valueType: { type: "number" } },
        {
          id: "shiftedInertia",
          label: "Shifted Inertia",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = inertiaParallelAxisContributionTool.execute;
export default inertiaParallelAxisContributionTool;
