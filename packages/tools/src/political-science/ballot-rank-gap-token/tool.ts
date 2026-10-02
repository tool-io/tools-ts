import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstRank: number;
  readonly secondRank: number;
  readonly tiedAllowed: boolean;
};
export type Output = {
  readonly gap: number;
  readonly tie: boolean;
  readonly permittedUnderTiePolicy: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstRank: { type: "integer", minimum: 1 },
    secondRank: { type: "integer", minimum: 1 },
    tiedAllowed: { type: "boolean" },
  },
  required: ["firstRank", "secondRank", "tiedAllowed"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    gap: { type: "integer" },
    tie: { type: "boolean" },
    permittedUnderTiePolicy: { type: "boolean" },
  },
  required: ["gap", "tie", "permittedUnderTiePolicy"],
} as const;
/** Inspect supplied ballot ranks without determining a jurisdiction’s ballot validity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstRank, secondRank, tiedAllowed } = request;
  const compute = (): Output => {
    H.integer(firstRank, 1);
    H.integer(secondRank, 1);
    return {
      gap: secondRank - firstRank,
      tie: firstRank === secondRank,
      permittedUnderTiePolicy: firstRank !== secondRank || tiedAllowed,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstRank: 2, secondRank: 4, tiedAllowed: false },
  output: { gap: 2, tie: false, permittedUnderTiePolicy: true },
} satisfies ToolExample<Input, Output>;
export const ballotRankGapTokenTool = H.defineSchemaCalculation<Input, Output>({
  ...{
    id: "political-science/ballot-rank-gap-token",
    title: "Ballot Rank Gap Token Tool",
    description:
      "Inspect supplied ballot ranks without determining a jurisdiction’s ballot validity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstRank: { type: "integer", minimum: 1 },
        secondRank: { type: "integer", minimum: 1 },
        tiedAllowed: { type: "boolean" },
      },
      required: ["firstRank", "secondRank", "tiedAllowed"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        gap: { type: "integer" },
        tie: { type: "boolean" },
        permittedUnderTiePolicy: { type: "boolean" },
      },
      required: ["gap", "tie", "permittedUnderTiePolicy"],
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
          id: "tiedAllowed",
          label: "Tied Allowed",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "gap", label: "Gap", valueType: { type: "integer" } },
        { id: "tie", label: "Tie", valueType: { type: "boolean" } },
        {
          id: "permittedUnderTiePolicy",
          label: "Permitted Under Tie Policy",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = ballotRankGapTokenTool.execute;
export default ballotRankGapTokenTool;
