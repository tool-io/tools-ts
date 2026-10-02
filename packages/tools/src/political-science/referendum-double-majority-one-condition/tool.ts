import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly yesVotes: number;
  readonly validVotes: number;
  readonly supportingRegions: number;
  readonly totalRegions: number;
  readonly voteThreshold: number;
  readonly regionThreshold: number;
};
export type Output = {
  readonly votePass: boolean;
  readonly regionPass: boolean;
  readonly bothPass: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    yesVotes: { type: "integer", minimum: 0 },
    validVotes: { type: "integer", minimum: 1 },
    supportingRegions: { type: "integer", minimum: 0 },
    totalRegions: { type: "integer", minimum: 1 },
    voteThreshold: { type: "number", minimum: 0, maximum: 1 },
    regionThreshold: { type: "number", minimum: 0, maximum: 1 },
  },
  required: [
    "yesVotes",
    "validVotes",
    "supportingRegions",
    "totalRegions",
    "voteThreshold",
    "regionThreshold",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    votePass: { type: "boolean" },
    regionPass: { type: "boolean" },
    bothPass: { type: "boolean" },
  },
  required: ["votePass", "regionPass", "bothPass"],
} as const;
/** Strictly exceed both caller-supplied thresholds on votes and regions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    yesVotes,
    validVotes,
    supportingRegions,
    totalRegions,
    voteThreshold,
    regionThreshold,
  } = request;
  const compute = (): Output => {
    H.integer(validVotes, 1);
    H.integer(yesVotes, 0, validVotes);
    H.integer(totalRegions, 1);
    H.integer(supportingRegions, 0, totalRegions);
    H.probability(voteThreshold);
    H.probability(regionThreshold);
    return {
      votePass: yesVotes / validVotes > voteThreshold,
      regionPass: supportingRegions / totalRegions > regionThreshold,
      bothPass:
        yesVotes / validVotes > voteThreshold &&
        supportingRegions / totalRegions > regionThreshold,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    yesVotes: 600,
    validVotes: 1000,
    supportingRegions: 6,
    totalRegions: 10,
    voteThreshold: 0.5,
    regionThreshold: 0.5,
  },
  output: { votePass: true, regionPass: true, bothPass: true },
} satisfies ToolExample<Input, Output>;
export const referendumDoubleMajorityOneConditionTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "political-science/referendum-double-majority-one-condition",
      title: "Referendum Double Majority One Condition Tool",
      description:
        "Strictly exceed both caller-supplied thresholds on votes and regions.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          yesVotes: { type: "integer", minimum: 0 },
          validVotes: { type: "integer", minimum: 1 },
          supportingRegions: { type: "integer", minimum: 0 },
          totalRegions: { type: "integer", minimum: 1 },
          voteThreshold: { type: "number", minimum: 0, maximum: 1 },
          regionThreshold: { type: "number", minimum: 0, maximum: 1 },
        },
        required: [
          "yesVotes",
          "validVotes",
          "supportingRegions",
          "totalRegions",
          "voteThreshold",
          "regionThreshold",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          votePass: { type: "boolean" },
          regionPass: { type: "boolean" },
          bothPass: { type: "boolean" },
        },
        required: ["votePass", "regionPass", "bothPass"],
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
            id: "validVotes",
            label: "Valid Votes",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "supportingRegions",
            label: "Supporting Regions",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "totalRegions",
            label: "Total Regions",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "voteThreshold",
            label: "Vote Threshold",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "regionThreshold",
            label: "Region Threshold",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "votePass",
            label: "Vote Pass",
            valueType: { type: "boolean" },
          },
          {
            id: "regionPass",
            label: "Region Pass",
            valueType: { type: "boolean" },
          },
          {
            id: "bothPass",
            label: "Both Pass",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = referendumDoubleMajorityOneConditionTool.execute;
export default referendumDoubleMajorityOneConditionTool;
