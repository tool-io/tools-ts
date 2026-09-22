import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly topCitationSum: number;
  readonly currentG: number;
  readonly nextPaperCitations: number;
};
export type Output = {
  readonly nextThreshold: number;
  readonly projectedSum: number;
  readonly headroom: number;
  readonly reachesNext: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    topCitationSum: { type: "integer", minimum: 0 },
    currentG: { type: "integer", minimum: 0 },
    nextPaperCitations: { type: "integer", minimum: 0 },
  },
  required: ["topCitationSum", "currentG", "nextPaperCitations"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    nextThreshold: { type: "integer" },
    projectedSum: { type: "integer" },
    headroom: { type: "integer" },
    reachesNext: { type: "boolean" },
  },
  required: ["nextThreshold", "projectedSum", "headroom", "reachesNext"],
} as const;
/** Check one g-index cumulative-square threshold assuming the caller supplied the correctly ranked prefix. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { topCitationSum, currentG, nextPaperCitations } = request;
  const compute = (): Output => {
    H.integer(topCitationSum, 0);
    H.integer(currentG, 0);
    H.integer(nextPaperCitations, 0);
    return {
      nextThreshold: (currentG + 1) ** 2,
      projectedSum: topCitationSum + nextPaperCitations,
      headroom: topCitationSum + nextPaperCitations - (currentG + 1) ** 2,
      reachesNext: topCitationSum + nextPaperCitations >= (currentG + 1) ** 2,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { topCitationSum: 10, currentG: 3, nextPaperCitations: 4 },
  output: {
    nextThreshold: 16,
    projectedSum: 14,
    headroom: -2,
    reachesNext: false,
  },
} satisfies ToolExample<Input, Output>;
export const gIndexSquaredSumHeadroomTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "bibliometrics/g-index-squared-sum-headroom",
    title: "G Index Squared Sum Headroom Tool",
    description:
      "Check one g-index cumulative-square threshold assuming the caller supplied the correctly ranked prefix.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        topCitationSum: { type: "integer", minimum: 0 },
        currentG: { type: "integer", minimum: 0 },
        nextPaperCitations: { type: "integer", minimum: 0 },
      },
      required: ["topCitationSum", "currentG", "nextPaperCitations"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        nextThreshold: { type: "integer" },
        projectedSum: { type: "integer" },
        headroom: { type: "integer" },
        reachesNext: { type: "boolean" },
      },
      required: ["nextThreshold", "projectedSum", "headroom", "reachesNext"],
    },
    ports: {
      inputs: [
        {
          id: "topCitationSum",
          label: "Top Citation Sum",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "currentG",
          label: "Current G",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "nextPaperCitations",
          label: "Next Paper Citations",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "nextThreshold",
          label: "Next Threshold",
          valueType: { type: "integer" },
        },
        {
          id: "projectedSum",
          label: "Projected Sum",
          valueType: { type: "integer" },
        },
        { id: "headroom", label: "Headroom", valueType: { type: "integer" } },
        {
          id: "reachesNext",
          label: "Reaches Next",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = gIndexSquaredSumHeadroomTool.execute;
export default gIndexSquaredSumHeadroomTool;
