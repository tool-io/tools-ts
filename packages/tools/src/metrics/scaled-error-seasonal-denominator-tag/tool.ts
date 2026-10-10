import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly metricId: string;
  readonly seasonalPeriodText: string;
  readonly denominatorSource: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    metricId: { type: "string", maxLength: 8192, minLength: 1 },
    seasonalPeriodText: { type: "string", maxLength: 8192, minLength: 1 },
    denominatorSource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["metricId", "seasonalPeriodText", "denominatorSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicit scaled-error denominator by seasonal-period wording and source without calculating or inferring the denominator. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { metricId, seasonalPeriodText, denominatorSource } = request;
  const compute = (): Output => {
    H.domain(metricId.length > 0, "metricId");
    H.domain(seasonalPeriodText.length > 0, "seasonalPeriodText");
    H.domain(denominatorSource.length > 0, "denominatorSource");
    return {
      token: JSON.stringify([metricId, seasonalPeriodText, denominatorSource]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    metricId: "MET17",
    seasonalPeriodText: "12",
    denominatorSource: "Training set A",
  },
  output: { token: '["MET17","12","Training set A"]' },
} satisfies ToolExample<Input, Output>;
export const scaledErrorSeasonalDenominatorTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["ai", "data"],
      fields: ["metrics", "evaluation metrics", "computer science"],
      keywords: ["evaluation metrics", "computer science"],
    },
    id: "metrics/scaled-error-seasonal-denominator-tag",
    title: "Scaled Error Seasonal Denominator Tag",
    description:
      "Qualify an explicit scaled-error denominator by seasonal-period wording and source without calculating or inferring the denominator.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        metricId: { type: "string", maxLength: 8192, minLength: 1 },
        seasonalPeriodText: { type: "string", maxLength: 8192, minLength: 1 },
        denominatorSource: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["metricId", "seasonalPeriodText", "denominatorSource"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
    },
    ports: {
      inputs: [
        {
          id: "metricId",
          label: "Metric Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "seasonalPeriodText",
          label: "Seasonal Period Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "denominatorSource",
          label: "Denominator Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = scaledErrorSeasonalDenominatorTagTool.execute;
export default scaledErrorSeasonalDenominatorTagTool;
