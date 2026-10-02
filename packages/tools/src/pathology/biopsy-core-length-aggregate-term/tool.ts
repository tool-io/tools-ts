import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly lengths: readonly number[];
  readonly fragmentedUnknownLength: number;
};
export type Output = {
  readonly measuredTotal: number;
  readonly longest: number;
  readonly totalIncludingEstimate: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lengths: { type: "array", maxItems: 256, items: { type: "number" } },
    fragmentedUnknownLength: { type: "number", minimum: 0 },
  },
  required: ["lengths", "fragmentedUnknownLength"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    measuredTotal: { type: "number" },
    longest: { type: "number" },
    totalIncludingEstimate: { type: "number" },
  },
  required: ["measuredTotal", "longest", "totalIncludingEstimate"],
} as const;
/** Measured research core-length aggregation with a separate supplied fragment estimate; no adequacy threshold or sampling guidance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { lengths, fragmentedUnknownLength } = request;
  const compute = (): Output => {
    H.domain(
      lengths.length > 0 &&
        lengths.every((x) => x >= 0) &&
        fragmentedUnknownLength >= 0,
    );
    return {
      measuredTotal: lengths.reduce((a, b) => a + b, 0),
      longest: Math.max(...lengths),
      totalIncludingEstimate:
        lengths.reduce((a, b) => a + b, 0) + fragmentedUnknownLength,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { lengths: [10, 12, 8], fragmentedUnknownLength: 3 },
  output: { measuredTotal: 30, longest: 12, totalIncludingEstimate: 33 },
} satisfies ToolExample<Input, Output>;
export const biopsyCoreLengthAggregateTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "pathology/biopsy-core-length-aggregate-term",
    title: "Biopsy Core Length Aggregate Term Tool",
    description:
      "Measured research core-length aggregation with a separate supplied fragment estimate; no adequacy threshold or sampling guidance.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lengths: { type: "array", maxItems: 256, items: { type: "number" } },
        fragmentedUnknownLength: { type: "number", minimum: 0 },
      },
      required: ["lengths", "fragmentedUnknownLength"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        measuredTotal: { type: "number" },
        longest: { type: "number" },
        totalIncludingEstimate: { type: "number" },
      },
      required: ["measuredTotal", "longest", "totalIncludingEstimate"],
    },
    ports: {
      inputs: [
        {
          id: "lengths",
          label: "Lengths",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "fragmentedUnknownLength",
          label: "Fragmented Unknown Length",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "measuredTotal",
          label: "Measured Total",
          valueType: { type: "number" },
        },
        { id: "longest", label: "Longest", valueType: { type: "number" } },
        {
          id: "totalIncludingEstimate",
          label: "Total Including Estimate",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = biopsyCoreLengthAggregateTermTool.execute;
export default biopsyCoreLengthAggregateTermTool;
