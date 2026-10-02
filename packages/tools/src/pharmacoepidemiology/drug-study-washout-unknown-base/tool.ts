import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly knownEligible: number;
  readonly knownIneligible: number;
  readonly unknown: number;
  readonly includeUnknown: boolean;
};
export type Output = {
  readonly denominator: number;
  readonly eligibleFraction: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    knownEligible: { type: "integer", minimum: 0 },
    knownIneligible: { type: "integer", minimum: 0 },
    unknown: { type: "integer", minimum: 0 },
    includeUnknown: { type: "boolean" },
  },
  required: ["knownEligible", "knownIneligible", "unknown", "includeUnknown"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    denominator: { type: "integer" },
    eligibleFraction: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["denominator", "eligibleFraction", "defined"],
} as const;
/** Audit supplied study washout classifications without selecting a washout duration or eligibility criterion. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { knownEligible, knownIneligible, unknown, includeUnknown } = request;
  const compute = (): Output => {
    H.integer(knownEligible, 0);
    H.integer(knownIneligible, 0);
    H.integer(unknown, 0);
    return {
      denominator:
        knownEligible + knownIneligible + (includeUnknown ? unknown : 0),
      eligibleFraction:
        knownEligible + knownIneligible + (includeUnknown ? unknown : 0) > 0
          ? knownEligible /
            (knownEligible + knownIneligible + (includeUnknown ? unknown : 0))
          : 0,
      defined:
        knownEligible + knownIneligible + (includeUnknown ? unknown : 0) > 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    knownEligible: 60,
    knownIneligible: 20,
    unknown: 20,
    includeUnknown: true,
  },
  output: { denominator: 100, eligibleFraction: 0.6, defined: true },
} satisfies ToolExample<Input, Output>;
export const drugStudyWashoutUnknownBaseTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "pharmacoepidemiology/drug-study-washout-unknown-base",
    title: "Drug Study Washout Unknown Base Tool",
    description:
      "Audit supplied study washout classifications without selecting a washout duration or eligibility criterion.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        knownEligible: { type: "integer", minimum: 0 },
        knownIneligible: { type: "integer", minimum: 0 },
        unknown: { type: "integer", minimum: 0 },
        includeUnknown: { type: "boolean" },
      },
      required: [
        "knownEligible",
        "knownIneligible",
        "unknown",
        "includeUnknown",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        denominator: { type: "integer" },
        eligibleFraction: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["denominator", "eligibleFraction", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "knownEligible",
          label: "Known Eligible",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "knownIneligible",
          label: "Known Ineligible",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "unknown",
          label: "Unknown",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "includeUnknown",
          label: "Include Unknown",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "denominator",
          label: "Denominator",
          valueType: { type: "integer" },
        },
        {
          id: "eligibleFraction",
          label: "Eligible Fraction",
          valueType: { type: "number" },
        },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = drugStudyWashoutUnknownBaseTool.execute;
export default drugStudyWashoutUnknownBaseTool;
