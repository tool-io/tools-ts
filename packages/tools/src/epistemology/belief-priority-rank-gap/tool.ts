import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstRank: number;
  readonly secondRank: number;
  readonly lowerRankHigherPriority: boolean;
};
export type Output = {
  readonly gap: number;
  readonly firstPreferred: boolean;
  readonly tie: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstRank: { type: "integer", minimum: 0 },
    secondRank: { type: "integer", minimum: 0 },
    lowerRankHigherPriority: { type: "boolean" },
  },
  required: ["firstRank", "secondRank", "lowerRankHigherPriority"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    gap: { type: "integer" },
    firstPreferred: { type: "boolean" },
    tie: { type: "boolean" },
  },
  required: ["gap", "firstPreferred", "tie"],
} as const;
/** Calculate belief priority rank gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstRank, secondRank, lowerRankHigherPriority } = request;
  const compute = (): Output => {
    H.integer(firstRank, 0);
    H.integer(secondRank, 0);
    return {
      gap: secondRank - firstRank,
      firstPreferred: lowerRankHigherPriority
        ? firstRank < secondRank
        : firstRank > secondRank,
      tie: firstRank === secondRank,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstRank: 2, secondRank: 4, lowerRankHigherPriority: true },
  output: { gap: 2, firstPreferred: true, tie: false },
} satisfies ToolExample<Input, Output>;
export const beliefPriorityRankGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "epistemology/belief-priority-rank-gap",
    title: "Belief Priority Rank Gap Tool",
    description:
      "Calculate belief priority rank gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstRank: { type: "integer", minimum: 0 },
        secondRank: { type: "integer", minimum: 0 },
        lowerRankHigherPriority: { type: "boolean" },
      },
      required: ["firstRank", "secondRank", "lowerRankHigherPriority"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        gap: { type: "integer" },
        firstPreferred: { type: "boolean" },
        tie: { type: "boolean" },
      },
      required: ["gap", "firstPreferred", "tie"],
    },
    ports: {
      inputs: [
        {
          id: "firstRank",
          label: "First Rank",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "secondRank",
          label: "Second Rank",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "lowerRankHigherPriority",
          label: "Lower Rank Higher Priority",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "gap", label: "Gap", valueType: { type: "integer" } },
        {
          id: "firstPreferred",
          label: "First Preferred",
          valueType: { type: "boolean" },
        },
        { id: "tie", label: "Tie", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = beliefPriorityRankGapTool.execute;
export default beliefPriorityRankGapTool;
