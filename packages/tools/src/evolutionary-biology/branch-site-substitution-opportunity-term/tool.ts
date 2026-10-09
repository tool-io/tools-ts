import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly branchDuration: number;
  readonly eligibleSites: number;
  readonly suppliedRatePerSiteTime: number;
};
export type Output = { readonly expectedSubstitutions: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    branchDuration: { type: "number", minimum: 0 },
    eligibleSites: { type: "integer", minimum: 0 },
    suppliedRatePerSiteTime: { type: "number", minimum: 0 },
  },
  required: ["branchDuration", "eligibleSites", "suppliedRatePerSiteTime"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { expectedSubstitutions: { type: "number" } },
  required: ["expectedSubstitutions"],
} as const;
/** Multiply explicit branch duration, eligible site count and supplied per-site-time rate without fitting an evolutionary substitution model. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { branchDuration, eligibleSites, suppliedRatePerSiteTime } = request;
  const compute = (): Output => {
    H.domain(branchDuration >= 0, "branchDuration");
    (H.domain(
      Number.isSafeInteger(eligibleSites) &&
        eligibleSites >= 0 &&
        eligibleSites <= Number.MAX_SAFE_INTEGER,
      "eligibleSites",
    ),
      eligibleSites);
    H.domain(suppliedRatePerSiteTime >= 0, "suppliedRatePerSiteTime");
    return {
      expectedSubstitutions:
        branchDuration * eligibleSites * suppliedRatePerSiteTime,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    branchDuration: 2,
    eligibleSites: 100,
    suppliedRatePerSiteTime: 0.01,
  },
  output: { expectedSubstitutions: 2 },
} satisfies ToolExample<Input, Output>;
export const branchSiteSubstitutionOpportunityTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "evolutionary-biology/branch-site-substitution-opportunity-term",
      title: "Branch Site Substitution Opportunity Term Tool",
      description:
        "Multiply explicit branch duration, eligible site count and supplied per-site-time rate without fitting an evolutionary substitution model.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          branchDuration: { type: "number", minimum: 0 },
          eligibleSites: { type: "integer", minimum: 0 },
          suppliedRatePerSiteTime: { type: "number", minimum: 0 },
        },
        required: [
          "branchDuration",
          "eligibleSites",
          "suppliedRatePerSiteTime",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { expectedSubstitutions: { type: "number" } },
        required: ["expectedSubstitutions"],
      },
      ports: {
        inputs: [
          {
            id: "branchDuration",
            label: "Branch Duration",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "eligibleSites",
            label: "Eligible Sites",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "suppliedRatePerSiteTime",
            label: "Supplied Rate Per Site Time",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "expectedSubstitutions",
            label: "Expected Substitutions",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = branchSiteSubstitutionOpportunityTermTool.execute;
export default branchSiteSubstitutionOpportunityTermTool;
