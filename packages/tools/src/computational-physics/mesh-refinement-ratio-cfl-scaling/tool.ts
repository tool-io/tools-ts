import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly oldStep: number;
  readonly refinementRatio: number;
  readonly spatialPower: number;
};
export type Output = { readonly newStep: number; readonly stepRatio: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    oldStep: { type: "number", minimum: 0 },
    refinementRatio: { type: "number", minimum: 1 },
    spatialPower: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["oldStep", "refinementRatio", "spatialPower"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { newStep: { type: "number" }, stepRatio: { type: "number" } },
  required: ["newStep", "stepRatio"],
} as const;
/** Caller-selected explicit time-step scaling power: one for advective and two for diffusive grid restrictions, without asserting full solver stability. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { oldStep, refinementRatio, spatialPower } = request;
  const compute = (): Output => {
    H.domain(oldStep >= 0 && refinementRatio >= 1 && spatialPower > 0);
    return {
      newStep: oldStep / refinementRatio ** spatialPower,
      stepRatio: 1 / refinementRatio ** spatialPower,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { oldStep: 1, refinementRatio: 2, spatialPower: 1 },
  output: { newStep: 0.5, stepRatio: 0.5 },
} satisfies ToolExample<Input, Output>;
export const meshRefinementRatioCflScalingTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "computational-physics/mesh-refinement-ratio-cfl-scaling",
    title: "Mesh Refinement Ratio CFL Scaling Tool",
    description:
      "Caller-selected explicit time-step scaling power: one for advective and two for diffusive grid restrictions, without asserting full solver stability.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        oldStep: { type: "number", minimum: 0 },
        refinementRatio: { type: "number", minimum: 1 },
        spatialPower: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["oldStep", "refinementRatio", "spatialPower"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        newStep: { type: "number" },
        stepRatio: { type: "number" },
      },
      required: ["newStep", "stepRatio"],
    },
    ports: {
      inputs: [
        {
          id: "oldStep",
          label: "Old Step",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "refinementRatio",
          label: "Refinement Ratio",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "spatialPower",
          label: "Spatial Power",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "newStep", label: "New Step", valueType: { type: "number" } },
        { id: "stepRatio", label: "Step Ratio", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = meshRefinementRatioCflScalingTool.execute;
export default meshRefinementRatioCflScalingTool;
