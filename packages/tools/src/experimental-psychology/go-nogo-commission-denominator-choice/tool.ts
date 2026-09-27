import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly commissionErrors: number;
  readonly nogoTrials: number;
  readonly excludedNogo: number;
};
export type Output = {
  readonly eligibleNogo: number;
  readonly commissionRate: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    commissionErrors: { type: "integer", minimum: 0 },
    nogoTrials: { type: "integer", minimum: 1 },
    excludedNogo: { type: "integer", minimum: 0 },
  },
  required: ["commissionErrors", "nogoTrials", "excludedNogo"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eligibleNogo: { type: "integer" },
    commissionRate: { type: "number" },
  },
  required: ["eligibleNogo", "commissionRate"],
} as const;
/** Calculate go nogo commission denominator choice from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { commissionErrors, nogoTrials, excludedNogo } = request;
  const compute = (): Output => {
    H.integer(nogoTrials, 1);
    H.integer(excludedNogo, 0, nogoTrials - 1);
    H.integer(commissionErrors, 0, nogoTrials - excludedNogo);
    return {
      eligibleNogo: nogoTrials - excludedNogo,
      commissionRate: commissionErrors / (nogoTrials - excludedNogo),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { commissionErrors: 4, nogoTrials: 25, excludedNogo: 5 },
  output: { eligibleNogo: 20, commissionRate: 0.2 },
} satisfies ToolExample<Input, Output>;
export const goNogoCommissionDenominatorChoiceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "experimental-psychology/go-nogo-commission-denominator-choice",
    title: "Go Nogo Commission Denominator Choice Tool",
    description:
      "Calculate go nogo commission denominator choice from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        commissionErrors: { type: "integer", minimum: 0 },
        nogoTrials: { type: "integer", minimum: 1 },
        excludedNogo: { type: "integer", minimum: 0 },
      },
      required: ["commissionErrors", "nogoTrials", "excludedNogo"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eligibleNogo: { type: "integer" },
        commissionRate: { type: "number" },
      },
      required: ["eligibleNogo", "commissionRate"],
    },
    ports: {
      inputs: [
        {
          id: "commissionErrors",
          label: "Commission Errors",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "nogoTrials",
          label: "Nogo Trials",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "excludedNogo",
          label: "Excluded Nogo",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "eligibleNogo",
          label: "Eligible Nogo",
          valueType: { type: "integer" },
        },
        {
          id: "commissionRate",
          label: "Commission Rate",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = goNogoCommissionDenominatorChoiceTool.execute;
export default goNogoCommissionDenominatorChoiceTool;
