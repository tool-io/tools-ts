import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly winnerVotes: number;
  readonly runnerUpVotes: number;
  readonly validVotes: number;
};
export type Output = {
  readonly marginVotes: number;
  readonly marginShare: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    winnerVotes: { type: "integer" },
    runnerUpVotes: { type: "integer", minimum: 0 },
    validVotes: { type: "integer", minimum: 1 },
  },
  required: ["winnerVotes", "runnerUpVotes", "validVotes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    marginVotes: { type: "integer" },
    marginShare: { type: "number" },
  },
  required: ["marginVotes", "marginShare"],
} as const;
/** Calculate plurality winning margin vote share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { winnerVotes, runnerUpVotes, validVotes } = request;
  const compute = (): Output => {
    H.integer(validVotes, 1);
    H.integer(runnerUpVotes, 0, validVotes);
    H.integer(winnerVotes, runnerUpVotes, validVotes - runnerUpVotes);
    return {
      marginVotes: winnerVotes - runnerUpVotes,
      marginShare: (winnerVotes - runnerUpVotes) / validVotes,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { winnerVotes: 500, runnerUpVotes: 400, validVotes: 1000 },
  output: { marginVotes: 100, marginShare: 0.1 },
} satisfies ToolExample<Input, Output>;
export const pluralityWinningMarginVoteShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "political-science/plurality-winning-margin-vote-share",
    title: "Plurality Winning Margin Vote Share Tool",
    description:
      "Calculate plurality winning margin vote share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        winnerVotes: { type: "integer" },
        runnerUpVotes: { type: "integer", minimum: 0 },
        validVotes: { type: "integer", minimum: 1 },
      },
      required: ["winnerVotes", "runnerUpVotes", "validVotes"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        marginVotes: { type: "integer" },
        marginShare: { type: "number" },
      },
      required: ["marginVotes", "marginShare"],
    },
    ports: {
      inputs: [
        {
          id: "winnerVotes",
          label: "Winner Votes",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "runnerUpVotes",
          label: "Runner Up Votes",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "validVotes",
          label: "Valid Votes",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "marginVotes",
          label: "Margin Votes",
          valueType: { type: "integer" },
        },
        {
          id: "marginShare",
          label: "Margin Share",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = pluralityWinningMarginVoteShareTool.execute;
export default pluralityWinningMarginVoteShareTool;
