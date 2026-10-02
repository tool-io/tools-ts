import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstVotes: readonly string[];
  readonly secondVotes: readonly string[];
  readonly ignoredTokens: readonly string[];
};
export type Output = {
  readonly compared: number;
  readonly disagreements: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstVotes: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    secondVotes: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    ignoredTokens: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["firstVotes", "secondVotes", "ignoredTokens"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    compared: { type: "integer" },
    disagreements: { type: "integer" },
  },
  required: ["compared", "disagreements"],
} as const;
/** Calculate public vote pair disagreement from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstVotes, secondVotes, ignoredTokens } = request;
  const compute = (): Output => {
    H.sameLength(firstVotes, secondVotes);
    return {
      compared: firstVotes.filter(
        (x, i) =>
          !ignoredTokens.includes(x) && !ignoredTokens.includes(secondVotes[i]),
      ).length,
      disagreements: firstVotes.filter(
        (x, i) =>
          !ignoredTokens.includes(x) &&
          !ignoredTokens.includes(secondVotes[i]) &&
          x !== secondVotes[i],
      ).length,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstVotes: ["yes", "no", "absent"],
    secondVotes: ["no", "no", "yes"],
    ignoredTokens: ["absent"],
  },
  output: { compared: 2, disagreements: 1 },
} satisfies ToolExample<Input, Output>;
export const publicVotePairDisagreementTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "political-science/public-vote-pair-disagreement",
    title: "Public Vote Pair Disagreement Tool",
    description:
      "Calculate public vote pair disagreement from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstVotes: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        secondVotes: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        ignoredTokens: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["firstVotes", "secondVotes", "ignoredTokens"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        compared: { type: "integer" },
        disagreements: { type: "integer" },
      },
      required: ["compared", "disagreements"],
    },
    ports: {
      inputs: [
        {
          id: "firstVotes",
          label: "First Votes",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "secondVotes",
          label: "Second Votes",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "ignoredTokens",
          label: "Ignored Tokens",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        { id: "compared", label: "Compared", valueType: { type: "integer" } },
        {
          id: "disagreements",
          label: "Disagreements",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = publicVotePairDisagreementTool.execute;
export default publicVotePairDisagreementTool;
