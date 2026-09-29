import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly yes: number;
  readonly no: number;
  readonly abstain: number;
  readonly abstentionWeight: number;
};
export type Output = {
  readonly weightedDenominator: number;
  readonly yesShare: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    yes: { type: "integer", minimum: 0 },
    no: { type: "integer", minimum: 0 },
    abstain: { type: "integer", minimum: 0 },
    abstentionWeight: { type: "number", minimum: 0 },
  },
  required: ["yes", "no", "abstain", "abstentionWeight"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    weightedDenominator: { type: "number" },
    yesShare: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["weightedDenominator", "yesShare", "defined"],
} as const;
/** Calculate public vote abstention weight from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { yes, no, abstain, abstentionWeight } = request;
  const compute = (): Output => {
    H.integer(yes, 0);
    H.integer(no, 0);
    H.integer(abstain, 0);
    H.domain(abstentionWeight >= 0);
    return {
      weightedDenominator: yes + no + abstain * abstentionWeight,
      yesShare:
        yes + no + abstain * abstentionWeight > 0
          ? yes / (yes + no + abstain * abstentionWeight)
          : 0,
      defined: yes + no + abstain * abstentionWeight > 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { yes: 6, no: 2, abstain: 4, abstentionWeight: 0.5 },
  output: { weightedDenominator: 10, yesShare: 0.6, defined: true },
} satisfies ToolExample<Input, Output>;
export const publicVoteAbstentionWeightTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "international-relations/public-vote-abstention-weight",
    title: "Public Vote Abstention Weight Tool",
    description:
      "Calculate public vote abstention weight from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        yes: { type: "integer", minimum: 0 },
        no: { type: "integer", minimum: 0 },
        abstain: { type: "integer", minimum: 0 },
        abstentionWeight: { type: "number", minimum: 0 },
      },
      required: ["yes", "no", "abstain", "abstentionWeight"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        weightedDenominator: { type: "number" },
        yesShare: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["weightedDenominator", "yesShare", "defined"],
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
          id: "abstentionWeight",
          label: "Abstention Weight",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "weightedDenominator",
          label: "Weighted Denominator",
          valueType: { type: "number" },
        },
        { id: "yesShare", label: "Yes Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = publicVoteAbstentionWeightTool.execute;
export default publicVoteAbstentionWeightTool;
