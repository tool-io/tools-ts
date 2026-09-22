import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly authorCredit: number;
  readonly affiliations: number;
  readonly eligibleAffiliations: number;
};
export type Output = {
  readonly perAffiliation: number;
  readonly eligibleCredit: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    authorCredit: { type: "number", minimum: 0 },
    affiliations: { type: "integer", minimum: 1 },
    eligibleAffiliations: { type: "integer", minimum: 0 },
  },
  required: ["authorCredit", "affiliations", "eligibleAffiliations"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    perAffiliation: { type: "number" },
    eligibleCredit: { type: "number" },
  },
  required: ["perAffiliation", "eligibleCredit"],
} as const;
/** Calculate affiliation count fractional credit term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { authorCredit, affiliations, eligibleAffiliations } = request;
  const compute = (): Output => {
    H.domain(authorCredit >= 0);
    H.integer(affiliations, 1);
    H.integer(eligibleAffiliations, 0, affiliations);
    return {
      perAffiliation: authorCredit / affiliations,
      eligibleCredit: (authorCredit * eligibleAffiliations) / affiliations,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { authorCredit: 0.5, affiliations: 2, eligibleAffiliations: 1 },
  output: { perAffiliation: 0.25, eligibleCredit: 0.25 },
} satisfies ToolExample<Input, Output>;
export const affiliationCountFractionalCreditTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "bibliometrics/affiliation-count-fractional-credit-term",
      title: "Affiliation Count Fractional Credit Term Tool",
      description:
        "Calculate affiliation count fractional credit term from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          authorCredit: { type: "number", minimum: 0 },
          affiliations: { type: "integer", minimum: 1 },
          eligibleAffiliations: { type: "integer", minimum: 0 },
        },
        required: ["authorCredit", "affiliations", "eligibleAffiliations"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          perAffiliation: { type: "number" },
          eligibleCredit: { type: "number" },
        },
        required: ["perAffiliation", "eligibleCredit"],
      },
      ports: {
        inputs: [
          {
            id: "authorCredit",
            label: "Author Credit",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "affiliations",
            label: "Affiliations",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "eligibleAffiliations",
            label: "Eligible Affiliations",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "perAffiliation",
            label: "Per Affiliation",
            valueType: { type: "number" },
          },
          {
            id: "eligibleCredit",
            label: "Eligible Credit",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = affiliationCountFractionalCreditTermTool.execute;
export default affiliationCountFractionalCreditTermTool;
