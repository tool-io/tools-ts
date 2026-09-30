import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly impressions: number;
  readonly uniqueReach: number;
  readonly targetFrequency: number;
};
export type Output = {
  readonly frequency: number;
  readonly impressionGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    impressions: { type: "integer" },
    uniqueReach: { type: "integer", minimum: 1 },
    targetFrequency: { type: "number", minimum: 0 },
  },
  required: ["impressions", "uniqueReach", "targetFrequency"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    frequency: { type: "number" },
    impressionGap: { type: "number" },
  },
  required: ["frequency", "impressionGap"],
} as const;
/** Calculate campaign frequency unique reach factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { impressions, uniqueReach, targetFrequency } = request;
  const compute = (): Output => {
    H.integer(uniqueReach, 1);
    H.integer(impressions, uniqueReach);
    H.domain(targetFrequency >= 0);
    return {
      frequency: impressions / uniqueReach,
      impressionGap: impressions - uniqueReach * targetFrequency,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { impressions: 1000, uniqueReach: 250, targetFrequency: 3 },
  output: { frequency: 4, impressionGap: 250 },
} satisfies ToolExample<Input, Output>;
export const campaignFrequencyUniqueReachFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "marketing/campaign-frequency-unique-reach-factor",
    title: "Campaign Frequency Unique Reach Factor Tool",
    description:
      "Calculate campaign frequency unique reach factor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        impressions: { type: "integer" },
        uniqueReach: { type: "integer", minimum: 1 },
        targetFrequency: { type: "number", minimum: 0 },
      },
      required: ["impressions", "uniqueReach", "targetFrequency"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        frequency: { type: "number" },
        impressionGap: { type: "number" },
      },
      required: ["frequency", "impressionGap"],
    },
    ports: {
      inputs: [
        {
          id: "impressions",
          label: "Impressions",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "uniqueReach",
          label: "Unique Reach",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "targetFrequency",
          label: "Target Frequency",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "frequency", label: "Frequency", valueType: { type: "number" } },
        {
          id: "impressionGap",
          label: "Impression Gap",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = campaignFrequencyUniqueReachFactorTool.execute;
export default campaignFrequencyUniqueReachFactorTool;
