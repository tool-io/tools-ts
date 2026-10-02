import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly eligible: number;
  readonly registered: number;
  readonly validVotes: number;
  readonly useEligible: boolean;
};
export type Output = {
  readonly denominator: number;
  readonly turnoutShare: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eligible: { type: "integer", minimum: 1 },
    registered: { type: "integer", minimum: 1 },
    validVotes: { type: "integer", minimum: 0 },
    useEligible: { type: "boolean" },
  },
  required: ["eligible", "registered", "validVotes", "useEligible"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    denominator: { type: "integer" },
    turnoutShare: { type: "number" },
  },
  required: ["denominator", "turnoutShare"],
} as const;
/** Calculate recall vote eligible base flag from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { eligible, registered, validVotes, useEligible } = request;
  const compute = (): Output => {
    H.integer(eligible, 1);
    H.integer(registered, 1, eligible);
    H.integer(validVotes, 0, registered);
    return {
      denominator: useEligible ? eligible : registered,
      turnoutShare: validVotes / (useEligible ? eligible : registered),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { eligible: 100, registered: 80, validVotes: 40, useEligible: true },
  output: { denominator: 100, turnoutShare: 0.4 },
} satisfies ToolExample<Input, Output>;
export const recallVoteEligibleBaseFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "political-science/recall-vote-eligible-base-flag",
    title: "Recall Vote Eligible Base Flag Tool",
    description:
      "Calculate recall vote eligible base flag from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eligible: { type: "integer", minimum: 1 },
        registered: { type: "integer", minimum: 1 },
        validVotes: { type: "integer", minimum: 0 },
        useEligible: { type: "boolean" },
      },
      required: ["eligible", "registered", "validVotes", "useEligible"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        denominator: { type: "integer" },
        turnoutShare: { type: "number" },
      },
      required: ["denominator", "turnoutShare"],
    },
    ports: {
      inputs: [
        {
          id: "eligible",
          label: "Eligible",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "registered",
          label: "Registered",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "validVotes",
          label: "Valid Votes",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "useEligible",
          label: "Use Eligible",
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
          id: "turnoutShare",
          label: "Turnout Share",
          valueType: { type: "number", unit: "1" },
        },
      ],
    },
  },
  calculate,
});
export const run = recallVoteEligibleBaseFlagTool.execute;
export default recallVoteEligibleBaseFlagTool;
