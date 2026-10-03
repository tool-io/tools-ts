import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly count: number;
  readonly quartile: number;
  readonly includeMedian: boolean;
};
export type Output = {
  readonly lowerHalfCount: number;
  readonly upperHalfStart: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    count: { type: "integer", minimum: 2 },
    quartile: { type: "integer" },
    includeMedian: { type: "boolean" },
  },
  required: ["count", "quartile", "includeMedian"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lowerHalfCount: { type: "integer" },
    upperHalfStart: { type: "integer" },
  },
  required: ["lowerHalfCount", "upperHalfStart"],
} as const;
/** Half-sample membership indices for median-of-halves quartiles, with explicit odd-median inclusion. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { count, quartile, includeMedian } = request;
  const compute = (): Output => {
    H.integer(count, 2);
    H.domain(quartile === 1 || quartile === 3);
    return {
      lowerHalfCount:
        Math.floor(count / 2) + (includeMedian && count % 2 === 1 ? 1 : 0),
      upperHalfStart:
        quartile === 1
          ? 0
          : Math.ceil(count / 2) - (includeMedian && count % 2 === 1 ? 1 : 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { count: 9, quartile: 3, includeMedian: false },
  output: { lowerHalfCount: 4, upperHalfStart: 5 },
} satisfies ToolExample<Input, Output>;
export const quartileRuleMidpointIndexTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "statistics/quartile-rule-midpoint-index",
    title: "Quartile Rule Midpoint Index Tool",
    description:
      "Half-sample membership indices for median-of-halves quartiles, with explicit odd-median inclusion.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        count: { type: "integer", minimum: 2 },
        quartile: { type: "integer" },
        includeMedian: { type: "boolean" },
      },
      required: ["count", "quartile", "includeMedian"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lowerHalfCount: { type: "integer" },
        upperHalfStart: { type: "integer" },
      },
      required: ["lowerHalfCount", "upperHalfStart"],
    },
    ports: {
      inputs: [
        {
          id: "count",
          label: "Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "quartile",
          label: "Quartile",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "includeMedian",
          label: "Include Median",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "lowerHalfCount",
          label: "Lower Half Count",
          valueType: { type: "integer" },
        },
        {
          id: "upperHalfStart",
          label: "Upper Half Start",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = quartileRuleMidpointIndexTool.execute;
export default quartileRuleMidpointIndexTool;
