import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstVotes: readonly number[];
  readonly secondVotes: readonly number[];
};
export type Output = {
  readonly prefixSurpluses: readonly number[];
  readonly allStrictlyPositive: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstVotes: { type: "array", maxItems: 256, items: { type: "integer" } },
    secondVotes: { type: "array", maxItems: 256, items: { type: "integer" } },
  },
  required: ["firstVotes", "secondVotes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    prefixSurpluses: {
      type: "array",
      maxItems: 256,
      items: { type: "integer" },
    },
    allStrictlyPositive: { type: "boolean" },
  },
  required: ["prefixSurpluses", "allStrictlyPositive"],
} as const;
/** Accumulate explicitly supplied paired vote-block counts into signed prefix surpluses without counting ballot arrangements. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstVotes, secondVotes } = request;
  const compute = (): Output => {
    H.domain(firstVotes.length === secondVotes.length, "secondVotes");
    let total = 0n;
    const prefixSurpluses = firstVotes.map((votes, i) => {
      H.domain(Number.isSafeInteger(votes) && votes >= 0, "firstVotes");
      (H.domain(
        Number.isSafeInteger(secondVotes[i]) &&
          secondVotes[i] >= 0 &&
          secondVotes[i] <= Number.MAX_SAFE_INTEGER,
        "secondVotes",
      ),
        secondVotes[i]);
      total += BigInt(votes) - BigInt(secondVotes[i]);
      H.domain(
        total >= BigInt(Number.MIN_SAFE_INTEGER) &&
          total <= BigInt(Number.MAX_SAFE_INTEGER),
        "firstVotes",
      );
      return Number(total);
    });
    return {
      prefixSurpluses,
      allStrictlyPositive: prefixSurpluses.every((value) => value > 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstVotes: [2, 1, 0], secondVotes: [0, 1, 1] },
  output: { prefixSurpluses: [2, 2, 1], allStrictlyPositive: true },
} satisfies ToolExample<Input, Output>;
export const ballotPrefixSurplusTool = H.defineSchemaCalculation<Input, Output>(
  {
    ...{
      discovery: {
        aliases: [],
        collections: ["data", "learn"],
        fields: ["combinatorics", "mathematics"],
        keywords: ["combinatorics", "mathematics"],
      },
      id: "combinatorics/ballot-prefix-surplus",
      title: "Ballot Prefix Surplus",
      description:
        "Accumulate explicitly supplied paired vote-block counts into signed prefix surpluses without counting ballot arrangements.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          firstVotes: {
            type: "array",
            maxItems: 256,
            items: { type: "integer" },
          },
          secondVotes: {
            type: "array",
            maxItems: 256,
            items: { type: "integer" },
          },
        },
        required: ["firstVotes", "secondVotes"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          prefixSurpluses: {
            type: "array",
            maxItems: 256,
            items: { type: "integer" },
          },
          allStrictlyPositive: { type: "boolean" },
        },
        required: ["prefixSurpluses", "allStrictlyPositive"],
      },
      ports: {
        inputs: [
          {
            id: "firstVotes",
            label: "First Votes",
            required: true,
            valueType: { type: "list", items: { type: "integer" } },
          },
          {
            id: "secondVotes",
            label: "Second Votes",
            required: true,
            valueType: { type: "list", items: { type: "integer" } },
          },
        ],
        outputs: [
          {
            id: "prefixSurpluses",
            label: "Prefix Surpluses",
            valueType: { type: "list", items: { type: "integer" } },
          },
          {
            id: "allStrictlyPositive",
            label: "All Strictly Positive",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  },
);
export const run = ballotPrefixSurplusTool.execute;
export default ballotPrefixSurplusTool;
