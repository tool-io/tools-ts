import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly reportedAge: number;
  readonly suppliedCutoff: number;
  readonly equalityEligible: boolean;
  readonly olderEligible: boolean;
};
export type Output = {
  readonly signedMargin: number;
  readonly eligibleUnderRule: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reportedAge: { type: "number" },
    suppliedCutoff: { type: "number" },
    equalityEligible: { type: "boolean" },
    olderEligible: { type: "boolean" },
  },
  required: [
    "reportedAge",
    "suppliedCutoff",
    "equalityEligible",
    "olderEligible",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    signedMargin: { type: "number" },
    eligibleUnderRule: { type: "boolean" },
  },
  required: ["signedMargin", "eligibleUnderRule"],
} as const;
/** Evaluate an explicit age-cutoff convention without determining program eligibility or applicable law. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { reportedAge, suppliedCutoff, equalityEligible, olderEligible } =
    request;
  const compute = (): Output => {
    return {
      signedMargin: (reportedAge - suppliedCutoff) * (olderEligible ? 1 : -1),
      eligibleUnderRule:
        (reportedAge - suppliedCutoff) * (olderEligible ? 1 : -1) > 0 ||
        (equalityEligible && reportedAge === suppliedCutoff),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    reportedAge: 65,
    suppliedCutoff: 65,
    equalityEligible: true,
    olderEligible: true,
  },
  output: { signedMargin: 0, eligibleUnderRule: true },
} satisfies ToolExample<Input, Output>;
export const eligibilityAgeCutoffMarginTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "health-policy/eligibility-age-cutoff-margin",
    title: "Eligibility Age Cutoff Margin Tool",
    description:
      "Evaluate an explicit age-cutoff convention without determining program eligibility or applicable law.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        reportedAge: { type: "number" },
        suppliedCutoff: { type: "number" },
        equalityEligible: { type: "boolean" },
        olderEligible: { type: "boolean" },
      },
      required: [
        "reportedAge",
        "suppliedCutoff",
        "equalityEligible",
        "olderEligible",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        signedMargin: { type: "number" },
        eligibleUnderRule: { type: "boolean" },
      },
      required: ["signedMargin", "eligibleUnderRule"],
    },
    ports: {
      inputs: [
        {
          id: "reportedAge",
          label: "Reported Age",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedCutoff",
          label: "Supplied Cutoff",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "equalityEligible",
          label: "Equality Eligible",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "olderEligible",
          label: "Older Eligible",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "signedMargin",
          label: "Signed Margin",
          valueType: { type: "number" },
        },
        {
          id: "eligibleUnderRule",
          label: "Eligible Under Rule",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = eligibilityAgeCutoffMarginTool.execute;
export default eligibilityAgeCutoffMarginTool;
