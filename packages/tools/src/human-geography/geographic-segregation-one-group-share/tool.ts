import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly localGroup: number;
  readonly localTotal: number;
  readonly totalGroup: number;
  readonly totalOther: number;
};
export type Output = {
  readonly groupDistribution: number;
  readonly otherDistribution: number;
  readonly dissimilarityContribution: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    localGroup: { type: "number", minimum: 0 },
    localTotal: { type: "number" },
    totalGroup: { type: "number", exclusiveMinimum: 0 },
    totalOther: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["localGroup", "localTotal", "totalGroup", "totalOther"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    groupDistribution: { type: "number" },
    otherDistribution: { type: "number" },
    dissimilarityContribution: { type: "number" },
  },
  required: [
    "groupDistribution",
    "otherDistribution",
    "dissimilarityContribution",
  ],
} as const;
/** One areal contribution to the two-group index of dissimilarity; the full index sums all mutually exclusive areas. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { localGroup, localTotal, totalGroup, totalOther } = request;
  const compute = (): Output => {
    H.positive(totalGroup);
    H.positive(totalOther);
    H.domain(
      localGroup >= 0 &&
        localGroup <= localTotal &&
        localGroup <= totalGroup &&
        localTotal - localGroup <= totalOther,
    );
    return {
      groupDistribution: localGroup / totalGroup,
      otherDistribution: (localTotal - localGroup) / totalOther,
      dissimilarityContribution:
        0.5 *
        Math.abs(
          localGroup / totalGroup - (localTotal - localGroup) / totalOther,
        ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { localGroup: 30, localTotal: 100, totalGroup: 300, totalOther: 700 },
  output: {
    groupDistribution: 0.1,
    otherDistribution: 0.1,
    dissimilarityContribution: 0,
  },
} satisfies ToolExample<Input, Output>;
export const geographicSegregationOneGroupShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "human-geography/geographic-segregation-one-group-share",
    title: "Geographic Segregation One Group Share Tool",
    description:
      "One areal contribution to the two-group index of dissimilarity; the full index sums all mutually exclusive areas.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        localGroup: { type: "number", minimum: 0 },
        localTotal: { type: "number" },
        totalGroup: { type: "number", exclusiveMinimum: 0 },
        totalOther: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["localGroup", "localTotal", "totalGroup", "totalOther"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        groupDistribution: { type: "number" },
        otherDistribution: { type: "number" },
        dissimilarityContribution: { type: "number" },
      },
      required: [
        "groupDistribution",
        "otherDistribution",
        "dissimilarityContribution",
      ],
    },
    ports: {
      inputs: [
        {
          id: "localGroup",
          label: "Local Group",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "localTotal",
          label: "Local Total",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "totalGroup",
          label: "Total Group",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "totalOther",
          label: "Total Other",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "groupDistribution",
          label: "Group Distribution",
          valueType: { type: "number" },
        },
        {
          id: "otherDistribution",
          label: "Other Distribution",
          valueType: { type: "number" },
        },
        {
          id: "dissimilarityContribution",
          label: "Dissimilarity Contribution",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = geographicSegregationOneGroupShareTool.execute;
export default geographicSegregationOneGroupShareTool;
