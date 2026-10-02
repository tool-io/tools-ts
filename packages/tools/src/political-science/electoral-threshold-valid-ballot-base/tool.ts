import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly partyVotes: number;
  readonly validVotes: number;
  readonly thresholdFraction: number;
  readonly inclusive: boolean;
};
export type Output = {
  readonly share: number;
  readonly marginVotes: number;
  readonly qualifies: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    partyVotes: { type: "integer", minimum: 0 },
    validVotes: { type: "integer", minimum: 1 },
    thresholdFraction: { type: "number", minimum: 0, maximum: 1 },
    inclusive: { type: "boolean" },
  },
  required: ["partyVotes", "validVotes", "thresholdFraction", "inclusive"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    share: { type: "number" },
    marginVotes: { type: "number" },
    qualifies: { type: "boolean" },
  },
  required: ["share", "marginVotes", "qualifies"],
} as const;
/** Calculate electoral threshold valid ballot base from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { partyVotes, validVotes, thresholdFraction, inclusive } = request;
  const compute = (): Output => {
    H.integer(validVotes, 1);
    H.integer(partyVotes, 0, validVotes);
    H.probability(thresholdFraction);
    return {
      share: partyVotes / validVotes,
      marginVotes: partyVotes - validVotes * thresholdFraction,
      qualifies: inclusive
        ? partyVotes >= validVotes * thresholdFraction
        : partyVotes > validVotes * thresholdFraction,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    partyVotes: 50,
    validVotes: 1000,
    thresholdFraction: 0.05,
    inclusive: true,
  },
  output: { share: 0.05, marginVotes: 0, qualifies: true },
} satisfies ToolExample<Input, Output>;
export const electoralThresholdValidBallotBaseTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "political-science/electoral-threshold-valid-ballot-base",
    title: "Electoral Threshold Valid Ballot Base Tool",
    description:
      "Calculate electoral threshold valid ballot base from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        partyVotes: { type: "integer", minimum: 0 },
        validVotes: { type: "integer", minimum: 1 },
        thresholdFraction: { type: "number", minimum: 0, maximum: 1 },
        inclusive: { type: "boolean" },
      },
      required: ["partyVotes", "validVotes", "thresholdFraction", "inclusive"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        share: { type: "number" },
        marginVotes: { type: "number" },
        qualifies: { type: "boolean" },
      },
      required: ["share", "marginVotes", "qualifies"],
    },
    ports: {
      inputs: [
        {
          id: "partyVotes",
          label: "Party Votes",
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
          id: "thresholdFraction",
          label: "Threshold Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "inclusive",
          label: "Inclusive",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "share", label: "Share", valueType: { type: "number" } },
        {
          id: "marginVotes",
          label: "Margin Votes",
          valueType: { type: "number" },
        },
        { id: "qualifies", label: "Qualifies", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = electoralThresholdValidBallotBaseTool.execute;
export default electoralThresholdValidBallotBaseTool;
