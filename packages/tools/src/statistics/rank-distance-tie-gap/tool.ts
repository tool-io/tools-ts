import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstMinimumRank: number;
  readonly firstMaximumRank: number;
  readonly secondMinimumRank: number;
  readonly secondMaximumRank: number;
};
export type Output = {
  readonly midrankGap: number;
  readonly closestGap: number;
  readonly largestGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstMinimumRank: { type: "number" },
    firstMaximumRank: { type: "number" },
    secondMinimumRank: { type: "number" },
    secondMaximumRank: { type: "number" },
  },
  required: [
    "firstMinimumRank",
    "firstMaximumRank",
    "secondMinimumRank",
    "secondMaximumRank",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    midrankGap: { type: "number" },
    closestGap: { type: "number" },
    largestGap: { type: "number" },
  },
  required: ["midrankGap", "closestGap", "largestGap"],
} as const;
/** Compare two explicit tied-rank intervals using midpoint, minimum and maximum distances. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    firstMinimumRank,
    firstMaximumRank,
    secondMinimumRank,
    secondMaximumRank,
  } = request;
  const compute = (): Output => {
    H.domain(
      firstMinimumRank <= firstMaximumRank &&
        secondMinimumRank <= secondMaximumRank,
    );
    return {
      midrankGap:
        secondMinimumRank / 2 +
        secondMaximumRank / 2 -
        (firstMinimumRank / 2 + firstMaximumRank / 2),
      closestGap: Math.max(
        0,
        firstMinimumRank - secondMaximumRank,
        secondMinimumRank - firstMaximumRank,
      ),
      largestGap: Math.max(
        Math.abs(firstMinimumRank - secondMaximumRank),
        Math.abs(firstMaximumRank - secondMinimumRank),
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstMinimumRank: 1,
    firstMaximumRank: 3,
    secondMinimumRank: 5,
    secondMaximumRank: 7,
  },
  output: { midrankGap: 4, closestGap: 2, largestGap: 6 },
} satisfies ToolExample<Input, Output>;
export const rankDistanceTieGapTool = H.defineSchemaCalculation<Input, Output>({
  ...{
    id: "statistics/rank-distance-tie-gap",
    title: "Rank Distance Tie Gap Tool",
    description:
      "Compare two explicit tied-rank intervals using midpoint, minimum and maximum distances.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstMinimumRank: { type: "number" },
        firstMaximumRank: { type: "number" },
        secondMinimumRank: { type: "number" },
        secondMaximumRank: { type: "number" },
      },
      required: [
        "firstMinimumRank",
        "firstMaximumRank",
        "secondMinimumRank",
        "secondMaximumRank",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        midrankGap: { type: "number" },
        closestGap: { type: "number" },
        largestGap: { type: "number" },
      },
      required: ["midrankGap", "closestGap", "largestGap"],
    },
    ports: {
      inputs: [
        {
          id: "firstMinimumRank",
          label: "First Minimum Rank",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "firstMaximumRank",
          label: "First Maximum Rank",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondMinimumRank",
          label: "Second Minimum Rank",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondMaximumRank",
          label: "Second Maximum Rank",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "midrankGap",
          label: "Midrank Gap",
          valueType: { type: "number" },
        },
        {
          id: "closestGap",
          label: "Closest Gap",
          valueType: { type: "number" },
        },
        {
          id: "largestGap",
          label: "Largest Gap",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = rankDistanceTieGapTool.execute;
export default rankDistanceTieGapTool;
