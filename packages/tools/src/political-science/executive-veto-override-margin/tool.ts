import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly yesVotes: number;
  readonly voteBase: number;
  readonly requiredNumerator: number;
  readonly requiredDenominator: number;
};
export type Output = {
  readonly required: number;
  readonly margin: number;
  readonly succeeds: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    yesVotes: { type: "integer", minimum: 0 },
    voteBase: { type: "integer", minimum: 1 },
    requiredNumerator: { type: "integer", minimum: 0 },
    requiredDenominator: { type: "integer", minimum: 1 },
  },
  required: [
    "yesVotes",
    "voteBase",
    "requiredNumerator",
    "requiredDenominator",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    required: { type: "integer" },
    margin: { type: "integer" },
    succeeds: { type: "boolean" },
  },
  required: ["required", "margin", "succeeds"],
} as const;
/** Calculate executive veto override margin from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { yesVotes, voteBase, requiredNumerator, requiredDenominator } =
    request;
  const compute = (): Output => {
    H.integer(voteBase, 1);
    H.integer(yesVotes, 0, voteBase);
    H.integer(requiredDenominator, 1);
    H.integer(requiredNumerator, 0, requiredDenominator);
    return {
      required: Math.ceil((voteBase * requiredNumerator) / requiredDenominator),
      margin:
        yesVotes -
        Math.ceil((voteBase * requiredNumerator) / requiredDenominator),
      succeeds:
        yesVotes >=
        Math.ceil((voteBase * requiredNumerator) / requiredDenominator),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    yesVotes: 67,
    voteBase: 100,
    requiredNumerator: 2,
    requiredDenominator: 3,
  },
  output: { required: 67, margin: 0, succeeds: true },
} satisfies ToolExample<Input, Output>;
export const executiveVetoOverrideMarginTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "political-science/executive-veto-override-margin",
    title: "Executive Veto Override Margin Tool",
    description:
      "Calculate executive veto override margin from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        yesVotes: { type: "integer", minimum: 0 },
        voteBase: { type: "integer", minimum: 1 },
        requiredNumerator: { type: "integer", minimum: 0 },
        requiredDenominator: { type: "integer", minimum: 1 },
      },
      required: [
        "yesVotes",
        "voteBase",
        "requiredNumerator",
        "requiredDenominator",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        required: { type: "integer" },
        margin: { type: "integer" },
        succeeds: { type: "boolean" },
      },
      required: ["required", "margin", "succeeds"],
    },
    ports: {
      inputs: [
        {
          id: "yesVotes",
          label: "Yes Votes",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "voteBase",
          label: "Vote Base",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "requiredNumerator",
          label: "Required Numerator",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "requiredDenominator",
          label: "Required Denominator",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "required", label: "Required", valueType: { type: "integer" } },
        { id: "margin", label: "Margin", valueType: { type: "integer" } },
        { id: "succeeds", label: "Succeeds", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = executiveVetoOverrideMarginTool.execute;
export default executiveVetoOverrideMarginTool;
