import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly eligible: readonly boolean[];
  readonly branchShown: readonly boolean[];
};
export type Output = {
  readonly excludedEligible: number;
  readonly shownIneligible: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eligible: { type: "array", maxItems: 256, items: { type: "boolean" } },
    branchShown: { type: "array", maxItems: 256, items: { type: "boolean" } },
  },
  required: ["eligible", "branchShown"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    excludedEligible: { type: "integer" },
    shownIneligible: { type: "integer" },
  },
  required: ["excludedEligible", "shownIneligible"],
} as const;
/** Calculate survey branch exclusion count from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { eligible, branchShown } = request;
  const compute = (): Output => {
    H.sameLength(eligible, branchShown);
    return {
      excludedEligible: eligible.filter((x, i) => x && !branchShown[i]).length,
      shownIneligible: eligible.filter((x, i) => !x && branchShown[i]).length,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { eligible: [true, true, false], branchShown: [true, false, true] },
  output: { excludedEligible: 1, shownIneligible: 1 },
} satisfies ToolExample<Input, Output>;
export const surveyBranchExclusionCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "disability-studies/survey-branch-exclusion-count",
    title: "Survey Branch Exclusion Count Tool",
    description:
      "Calculate survey branch exclusion count from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eligible: { type: "array", maxItems: 256, items: { type: "boolean" } },
        branchShown: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
      },
      required: ["eligible", "branchShown"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        excludedEligible: { type: "integer" },
        shownIneligible: { type: "integer" },
      },
      required: ["excludedEligible", "shownIneligible"],
    },
    ports: {
      inputs: [
        {
          id: "eligible",
          label: "Eligible",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "branchShown",
          label: "Branch Shown",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "excludedEligible",
          label: "Excluded Eligible",
          valueType: { type: "integer" },
        },
        {
          id: "shownIneligible",
          label: "Shown Ineligible",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = surveyBranchExclusionCountTool.execute;
export default surveyBranchExclusionCountTool;
