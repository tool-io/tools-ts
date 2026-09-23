import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly mass: number;
  readonly centroidDistance: number;
  readonly centroidalInertia: number;
};
export type Output = {
  readonly parallelAxisTerm: number;
  readonly totalInertia: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    mass: { type: "number", minimum: 0 },
    centroidDistance: { type: "number" },
    centroidalInertia: { type: "number", minimum: 0 },
  },
  required: ["mass", "centroidDistance", "centroidalInertia"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    parallelAxisTerm: { type: "number" },
    totalInertia: { type: "number" },
  },
  required: ["parallelAxisTerm", "totalInertia"],
} as const;
/** Apply the parallel-axis contribution to explicitly supplied segment mass and centroidal inertia. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { mass, centroidDistance, centroidalInertia } = request;
  const compute = (): Output => {
    H.domain(mass >= 0 && centroidalInertia >= 0);
    return {
      parallelAxisTerm: mass * centroidDistance ** 2,
      totalInertia: centroidalInertia + mass * centroidDistance ** 2,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { mass: 2, centroidDistance: 3, centroidalInertia: 1 },
  output: { parallelAxisTerm: 18, totalInertia: 19 },
} satisfies ToolExample<Input, Output>;
export const segmentMassMomentContributionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biomechanics/segment-mass-moment-contribution",
    title: "Segment Mass Moment Contribution Tool",
    description:
      "Apply the parallel-axis contribution to explicitly supplied segment mass and centroidal inertia.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        mass: { type: "number", minimum: 0 },
        centroidDistance: { type: "number" },
        centroidalInertia: { type: "number", minimum: 0 },
      },
      required: ["mass", "centroidDistance", "centroidalInertia"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        parallelAxisTerm: { type: "number" },
        totalInertia: { type: "number" },
      },
      required: ["parallelAxisTerm", "totalInertia"],
    },
    ports: {
      inputs: [
        {
          id: "mass",
          label: "Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "centroidDistance",
          label: "Centroid Distance",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "centroidalInertia",
          label: "Centroidal Inertia",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "parallelAxisTerm",
          label: "Parallel Axis Term",
          valueType: { type: "number" },
        },
        {
          id: "totalInertia",
          label: "Total Inertia",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = segmentMassMomentContributionTool.execute;
export default segmentMassMomentContributionTool;
