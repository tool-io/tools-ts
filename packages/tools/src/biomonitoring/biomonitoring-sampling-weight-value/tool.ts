import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observationValue: number;
  readonly suppliedSamplingWeight: number;
};
export type Output = { readonly weightedContribution: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observationValue: { type: "number" },
    suppliedSamplingWeight: { type: "number", minimum: 0 },
  },
  required: ["observationValue", "suppliedSamplingWeight"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { weightedContribution: { type: "number" } },
  required: ["weightedContribution"],
} as const;
/** Multiply an explicit observation by its supplied nonnegative sampling weight without estimating a population statistic. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observationValue, suppliedSamplingWeight } = request;
  const compute = (): Output => {
    H.domain(suppliedSamplingWeight >= 0, "suppliedSamplingWeight");
    return { weightedContribution: observationValue * suppliedSamplingWeight };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { observationValue: 12, suppliedSamplingWeight: 2.5 },
  output: { weightedContribution: 30 },
} satisfies ToolExample<Input, Output>;
export const biomonitoringSamplingWeightValueTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["biomonitoring", "biology"],
      keywords: ["biomonitoring", "biology"],
    },
    id: "biomonitoring/biomonitoring-sampling-weight-value",
    title: "Biomonitoring Sampling Weight Value",
    description:
      "Multiply an explicit observation by its supplied nonnegative sampling weight without estimating a population statistic.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observationValue: { type: "number" },
        suppliedSamplingWeight: { type: "number", minimum: 0 },
      },
      required: ["observationValue", "suppliedSamplingWeight"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { weightedContribution: { type: "number" } },
      required: ["weightedContribution"],
    },
    ports: {
      inputs: [
        {
          id: "observationValue",
          label: "Observation Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedSamplingWeight",
          label: "Supplied Sampling Weight",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "weightedContribution",
          label: "Weighted Contribution",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = biomonitoringSamplingWeightValueTool.execute;
export default biomonitoringSamplingWeightValueTool;
