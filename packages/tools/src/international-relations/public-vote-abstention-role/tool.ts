import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly yes: number;
  readonly no: number;
  readonly abstain: number;
  readonly includeAbstentions: boolean;
};
export type Output = {
  readonly denominator: number;
  readonly yesShare: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    yes: { type: "integer", minimum: 0 },
    no: { type: "integer", minimum: 0 },
    abstain: { type: "integer", minimum: 0 },
    includeAbstentions: { type: "boolean" },
  },
  required: ["yes", "no", "abstain", "includeAbstentions"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    denominator: { type: "integer" },
    yesShare: { type: "number" },
  },
  required: ["denominator", "yesShare"],
} as const;
/** Report a supplied vote share under an explicit abstention-denominator convention. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { yes, no, abstain, includeAbstentions } = request;
  const compute = (): Output => {
    H.integer(yes, 0);
    H.integer(no, 0);
    H.integer(abstain, 0);
    const denominator = yes + no + (includeAbstentions ? abstain : 0);
    H.domain(denominator > 0);
    return { denominator, yesShare: yes / denominator };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { yes: 6, no: 4, abstain: 2, includeAbstentions: false },
  output: { denominator: 10, yesShare: 0.6 },
} satisfies ToolExample<Input, Output>;
export const publicVoteAbstentionRoleTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "international-relations/public-vote-abstention-role",
    title: "Public Vote Abstention Role Tool",
    description:
      "Report a supplied vote share under an explicit abstention-denominator convention.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        yes: { type: "integer", minimum: 0 },
        no: { type: "integer", minimum: 0 },
        abstain: { type: "integer", minimum: 0 },
        includeAbstentions: { type: "boolean" },
      },
      required: ["yes", "no", "abstain", "includeAbstentions"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        denominator: { type: "integer" },
        yesShare: { type: "number" },
      },
      required: ["denominator", "yesShare"],
    },
    ports: {
      inputs: [
        {
          id: "yes",
          label: "Yes",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "no",
          label: "No",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "abstain",
          label: "Abstain",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "includeAbstentions",
          label: "Include Abstentions",
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
          id: "yesShare",
          label: "Yes Share",
          valueType: { type: "number", unit: "1" },
        },
      ],
    },
  },
  calculate,
});
export const run = publicVoteAbstentionRoleTool.execute;
export default publicVoteAbstentionRoleTool;
