import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly voteLabels: readonly string[];
  readonly eligible: readonly boolean[];
  readonly selectedLabel: string;
  readonly excludeLabels: readonly string[];
};
export type Output = {
  readonly eligibleVotes: number;
  readonly selectedVotes: number;
  readonly share: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    voteLabels: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    eligible: { type: "array", maxItems: 256, items: { type: "boolean" } },
    selectedLabel: { type: "string", maxLength: 8192 },
    excludeLabels: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["voteLabels", "eligible", "selectedLabel", "excludeLabels"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eligibleVotes: { type: "integer" },
    selectedVotes: { type: "integer" },
    share: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["eligibleVotes", "selectedVotes", "share", "defined"],
} as const;
/** Count supplied public rollcall labels with an explicit eligibility and excluded-label denominator. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { voteLabels, eligible, selectedLabel, excludeLabels } = request;
  const compute = (): Output => {
    H.sameLength(voteLabels, eligible);
    return (() => {
      const mask = eligible.map(
          (x, i) => x && !excludeLabels.includes(voteLabels[i]),
        ),
        eligibleVotes = mask.filter(Boolean).length,
        selectedVotes = mask.filter(
          (x, i) => x && voteLabels[i] === selectedLabel,
        ).length;
      return {
        eligibleVotes,
        selectedVotes,
        share: eligibleVotes > 0 ? selectedVotes / eligibleVotes : 0,
        defined: eligibleVotes > 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    voteLabels: ["yes", "no", "abstain"],
    eligible: [true, true, true],
    selectedLabel: "yes",
    excludeLabels: ["abstain"],
  },
  output: { eligibleVotes: 2, selectedVotes: 1, share: 0.5, defined: true },
} satisfies ToolExample<Input, Output>;
export const publicRollcallEligibleVoteShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "political-science/public-rollcall-eligible-vote-share",
    title: "Public Rollcall Eligible Vote Share Tool",
    description:
      "Count supplied public rollcall labels with an explicit eligibility and excluded-label denominator.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        voteLabels: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        eligible: { type: "array", maxItems: 256, items: { type: "boolean" } },
        selectedLabel: { type: "string", maxLength: 8192 },
        excludeLabels: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["voteLabels", "eligible", "selectedLabel", "excludeLabels"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eligibleVotes: { type: "integer" },
        selectedVotes: { type: "integer" },
        share: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["eligibleVotes", "selectedVotes", "share", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "voteLabels",
          label: "Vote Labels",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "eligible",
          label: "Eligible",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "selectedLabel",
          label: "Selected Label",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "excludeLabels",
          label: "Exclude Labels",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "eligibleVotes",
          label: "Eligible Votes",
          valueType: { type: "integer" },
        },
        {
          id: "selectedVotes",
          label: "Selected Votes",
          valueType: { type: "integer" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = publicRollcallEligibleVoteShareTool.execute;
export default publicRollcallEligibleVoteShareTool;
