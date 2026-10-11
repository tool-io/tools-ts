import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly value: number;
  readonly referenceOrigin: number;
  readonly weight: number;
  readonly totalWeight: number;
};
export type Output = { readonly contribution: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: { type: "number" },
    referenceOrigin: { type: "number" },
    weight: { type: "number", minimum: 0 },
    totalWeight: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["value", "referenceOrigin", "weight", "totalWeight"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { contribution: { type: "number" } },
  required: ["contribution"],
} as const;
/** Calculate one explicit weight-normalized squared-distance contribution about a supplied origin without estimating variance degrees of freedom. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { value, referenceOrigin, weight, totalWeight } = request;
  const compute = (): Output => {
    H.domain(weight >= 0, "weight");
    (H.domain(Number.isFinite(totalWeight) && totalWeight > 0, "totalWeight"),
      totalWeight);
    H.domain(weight <= totalWeight, "weight");
    return {
      contribution:
        (weight / totalWeight) *
        (value - referenceOrigin) *
        (value - referenceOrigin),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { value: 5, referenceOrigin: 1, weight: 2, totalWeight: 8 },
  output: { contribution: 4 },
} satisfies ToolExample<Input, Output>;
export const weightedSecondMomentContributionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["statistics", "mathematics"],
      keywords: ["statistics", "mathematics"],
    },
    id: "statistics/weighted-second-moment-contribution",
    title: "Weighted Second Moment Contribution",
    description:
      "Calculate one explicit weight-normalized squared-distance contribution about a supplied origin without estimating variance degrees of freedom.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        value: { type: "number" },
        referenceOrigin: { type: "number" },
        weight: { type: "number", minimum: 0 },
        totalWeight: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["value", "referenceOrigin", "weight", "totalWeight"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { contribution: { type: "number" } },
      required: ["contribution"],
    },
    ports: {
      inputs: [
        {
          id: "value",
          label: "Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceOrigin",
          label: "Reference Origin",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "weight",
          label: "Weight",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "totalWeight",
          label: "Total Weight",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "contribution",
          label: "Contribution",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = weightedSecondMomentContributionTool.execute;
export default weightedSecondMomentContributionTool;
