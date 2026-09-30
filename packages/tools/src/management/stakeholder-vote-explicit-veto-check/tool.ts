import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly votes: readonly boolean[];
  readonly vetoRights: readonly boolean[];
  readonly minimumYes: number;
};
export type Output = {
  readonly yes: number;
  readonly vetoed: boolean;
  readonly passes: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    votes: { type: "array", maxItems: 256, items: { type: "boolean" } },
    vetoRights: { type: "array", maxItems: 256, items: { type: "boolean" } },
    minimumYes: { type: "integer", minimum: 0 },
  },
  required: ["votes", "vetoRights", "minimumYes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    yes: { type: "integer" },
    vetoed: { type: "boolean" },
    passes: { type: "boolean" },
  },
  required: ["yes", "vetoed", "passes"],
} as const;
/** Apply explicit per-voter veto flags and a caller-selected affirmative vote count. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { votes, vetoRights, minimumYes } = request;
  const compute = (): Output => {
    H.sameLength(votes, vetoRights);
    H.integer(minimumYes, 0, votes.length);
    const yes = votes.filter(Boolean).length,
      vetoed = votes.some((v, i) => !v && vetoRights[i]);
    return { yes, vetoed, passes: yes >= minimumYes && !vetoed };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    votes: [true, true, false],
    vetoRights: [false, false, true],
    minimumYes: 2,
  },
  output: { yes: 2, vetoed: true, passes: false },
} satisfies ToolExample<Input, Output>;
export const stakeholderVoteExplicitVetoCheckTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "management/stakeholder-vote-explicit-veto-check",
    title: "Stakeholder Vote Explicit Veto Check Tool",
    description:
      "Apply explicit per-voter veto flags and a caller-selected affirmative vote count.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        votes: { type: "array", maxItems: 256, items: { type: "boolean" } },
        vetoRights: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
        minimumYes: { type: "integer", minimum: 0 },
      },
      required: ["votes", "vetoRights", "minimumYes"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        yes: { type: "integer" },
        vetoed: { type: "boolean" },
        passes: { type: "boolean" },
      },
      required: ["yes", "vetoed", "passes"],
    },
    ports: {
      inputs: [
        {
          id: "votes",
          label: "Votes",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "vetoRights",
          label: "Veto Rights",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "minimumYes",
          label: "Minimum Yes",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "yes", label: "Yes", valueType: { type: "integer" } },
        { id: "vetoed", label: "Vetoed", valueType: { type: "boolean" } },
        { id: "passes", label: "Passes", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = stakeholderVoteExplicitVetoCheckTool.execute;
export default stakeholderVoteExplicitVetoCheckTool;
