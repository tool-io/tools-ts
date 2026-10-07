import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly totalTravelCost: number;
  readonly participantCount: number;
  readonly subsidizedFraction: number;
};
export type Output = {
  readonly subsidyAmount: number;
  readonly participantCostEach: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalTravelCost: { type: "number", minimum: 0 },
    participantCount: { type: "integer", minimum: 1 },
    subsidizedFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["totalTravelCost", "participantCount", "subsidizedFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    subsidyAmount: { type: "number" },
    participantCostEach: { type: "number" },
  },
  required: ["subsidyAmount", "participantCostEach"],
} as const;
/** Split an explicit event travel cost between a supplied subsidy fraction and equal participant contributions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { totalTravelCost, participantCount, subsidizedFraction } = request;
  const compute = (): Output => {
    H.domain(totalTravelCost >= 0, "totalTravelCost");
    (H.domain(
      Number.isSafeInteger(participantCount) &&
        participantCount >= 1 &&
        participantCount <= Number.MAX_SAFE_INTEGER,
      "participantCount",
    ),
      participantCount);
    (H.domain(
      subsidizedFraction >= 0 && subsidizedFraction <= 1,
      "subsidizedFraction",
    ),
      subsidizedFraction);
    return {
      subsidyAmount: totalTravelCost * subsidizedFraction,
      participantCostEach:
        (totalTravelCost * (1 - subsidizedFraction)) / participantCount,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { totalTravelCost: 120, participantCount: 6, subsidizedFraction: 0.5 },
  output: { subsidyAmount: 60, participantCostEach: 10 },
} satisfies ToolExample<Input, Output>;
export const communityEventTravelCostShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "community-development",
        "community development",
        "social sciences",
      ],
      keywords: ["community development", "social sciences"],
    },
    id: "community-development/community-event-travel-cost-share",
    title: "Community Event Travel Cost Share",
    description:
      "Split an explicit event travel cost between a supplied subsidy fraction and equal participant contributions.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalTravelCost: { type: "number", minimum: 0 },
        participantCount: { type: "integer", minimum: 1 },
        subsidizedFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["totalTravelCost", "participantCount", "subsidizedFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        subsidyAmount: { type: "number" },
        participantCostEach: { type: "number" },
      },
      required: ["subsidyAmount", "participantCostEach"],
    },
    ports: {
      inputs: [
        {
          id: "totalTravelCost",
          label: "Total Travel Cost",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "participantCount",
          label: "Participant Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "subsidizedFraction",
          label: "Subsidized Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "subsidyAmount",
          label: "Subsidy Amount",
          valueType: { type: "number" },
        },
        {
          id: "participantCostEach",
          label: "Participant Cost Each",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = communityEventTravelCostShareTool.execute;
export default communityEventTravelCostShareTool;
