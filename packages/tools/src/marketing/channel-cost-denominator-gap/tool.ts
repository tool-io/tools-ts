import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly reportedDenominator: number;
  readonly eligibleConversions: number;
};
export type Output = { readonly gap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reportedDenominator: { type: "number", minimum: 0 },
    eligibleConversions: { type: "number", minimum: 0 },
  },
  required: ["reportedDenominator", "eligibleConversions"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { gap: { type: "number" } },
  required: ["gap"],
} as const;
/** Compare explicitly supplied channel cost denominators without attributing conversions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { reportedDenominator, eligibleConversions } = request;
  const compute = (): Output => {
    H.domain(reportedDenominator >= 0 && eligibleConversions >= 0);
    return { gap: reportedDenominator - eligibleConversions };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { reportedDenominator: 100, eligibleConversions: 80 },
  output: { gap: 20 },
} satisfies ToolExample<Input, Output>;
export const channelCostDenominatorGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "marketing/channel-cost-denominator-gap",
    title: "Channel Cost Denominator Gap Tool",
    description:
      "Compare explicitly supplied channel cost denominators without attributing conversions.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        reportedDenominator: { type: "number", minimum: 0 },
        eligibleConversions: { type: "number", minimum: 0 },
      },
      required: ["reportedDenominator", "eligibleConversions"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { gap: { type: "number" } },
      required: ["gap"],
    },
    ports: {
      inputs: [
        {
          id: "reportedDenominator",
          label: "Reported Denominator",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "eligibleConversions",
          label: "Eligible Conversions",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [{ id: "gap", label: "Gap", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = channelCostDenominatorGapTool.execute;
export default channelCostDenominatorGapTool;
