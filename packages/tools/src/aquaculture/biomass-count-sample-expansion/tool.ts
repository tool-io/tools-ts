import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sampleMass: number;
  readonly sampledCount: number;
  readonly totalCount: number;
};
export type Output = {
  readonly meanMass: number;
  readonly expandedMass: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sampleMass: { type: "number", minimum: 0 },
    sampledCount: { type: "integer", minimum: 1 },
    totalCount: { type: "integer" },
  },
  required: ["sampleMass", "sampledCount", "totalCount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    meanMass: { type: "number" },
    expandedMass: { type: "number" },
  },
  required: ["meanMass", "expandedMass"],
} as const;
/** Expand a supplied representative sample mean to a supplied total count without species or growth assumptions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sampleMass, sampledCount, totalCount } = request;
  const compute = (): Output => {
    H.integer(sampledCount, 1);
    H.integer(totalCount, sampledCount);
    H.domain(sampleMass >= 0);
    return {
      meanMass: sampleMass / sampledCount,
      expandedMass: (sampleMass / sampledCount) * totalCount,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sampleMass: 20, sampledCount: 5, totalCount: 100 },
  output: { meanMass: 4, expandedMass: 400 },
} satisfies ToolExample<Input, Output>;
export const biomassCountSampleExpansionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "aquaculture/biomass-count-sample-expansion",
    title: "Biomass Count Sample Expansion Tool",
    description:
      "Expand a supplied representative sample mean to a supplied total count without species or growth assumptions.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sampleMass: { type: "number", minimum: 0 },
        sampledCount: { type: "integer", minimum: 1 },
        totalCount: { type: "integer" },
      },
      required: ["sampleMass", "sampledCount", "totalCount"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        meanMass: { type: "number" },
        expandedMass: { type: "number" },
      },
      required: ["meanMass", "expandedMass"],
    },
    ports: {
      inputs: [
        {
          id: "sampleMass",
          label: "Sample Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sampledCount",
          label: "Sampled Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "totalCount",
          label: "Total Count",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "meanMass", label: "Mean Mass", valueType: { type: "number" } },
        {
          id: "expandedMass",
          label: "Expanded Mass",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = biomassCountSampleExpansionTool.execute;
export default biomassCountSampleExpansionTool;
