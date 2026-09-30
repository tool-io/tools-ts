import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly count: number;
  readonly suppliedInverseEffectiveVolume: number;
  readonly totalDenominatorWeight: number;
};
export type Output = { readonly normalizedContribution: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    count: { type: "integer", minimum: 0 },
    suppliedInverseEffectiveVolume: { type: "number", exclusiveMinimum: 0 },
    totalDenominatorWeight: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "count",
    "suppliedInverseEffectiveVolume",
    "totalDenominatorWeight",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { normalizedContribution: { type: "number" } },
  required: ["normalizedContribution"],
} as const;
/** Compute one supplied benign observation count’s weighted denominator contribution without a culturing method or organism inference. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { count, suppliedInverseEffectiveVolume, totalDenominatorWeight } =
    request;
  const compute = (): Output => {
    H.integer(count, 0);
    H.positive(suppliedInverseEffectiveVolume);
    H.positive(totalDenominatorWeight);
    return {
      normalizedContribution:
        (count * suppliedInverseEffectiveVolume) / totalDenominatorWeight,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    count: 20,
    suppliedInverseEffectiveVolume: 5,
    totalDenominatorWeight: 2,
  },
  output: { normalizedContribution: 50 },
} satisfies ToolExample<Input, Output>;
export const colonyCountDenominatorContributionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "microbiology/colony-count-denominator-contribution",
    title: "Colony Count Denominator Contribution Tool",
    description:
      "Compute one supplied benign observation count’s weighted denominator contribution without a culturing method or organism inference.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        count: { type: "integer", minimum: 0 },
        suppliedInverseEffectiveVolume: { type: "number", exclusiveMinimum: 0 },
        totalDenominatorWeight: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "count",
        "suppliedInverseEffectiveVolume",
        "totalDenominatorWeight",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { normalizedContribution: { type: "number" } },
      required: ["normalizedContribution"],
    },
    ports: {
      inputs: [
        {
          id: "count",
          label: "Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "suppliedInverseEffectiveVolume",
          label: "Supplied Inverse Effective Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "totalDenominatorWeight",
          label: "Total Denominator Weight",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "normalizedContribution",
          label: "Normalized Contribution",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = colonyCountDenominatorContributionTool.execute;
export default colonyCountDenominatorContributionTool;
