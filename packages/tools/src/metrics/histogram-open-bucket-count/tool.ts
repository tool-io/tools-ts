import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly upperBounds: readonly number[] };
export type Output = {
  readonly openBuckets: number;
  readonly finiteBuckets: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    upperBounds: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["upperBounds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    openBuckets: { type: "integer" },
    finiteBuckets: { type: "integer" },
  },
  required: ["openBuckets", "finiteBuckets"],
} as const;
/** Count finite histogram buckets plus the one conventional unbounded final bucket from strictly increasing finite bounds. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { upperBounds } = request;
  const compute = (): Output => {
    H.domain(upperBounds.every((x, i) => i === 0 || x > upperBounds[i - 1]));
    return { openBuckets: 1, finiteBuckets: upperBounds.length };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { upperBounds: [1, 5, 10] },
  output: { openBuckets: 1, finiteBuckets: 3 },
} satisfies ToolExample<Input, Output>;
export const histogramOpenBucketCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "metrics/histogram-open-bucket-count",
    title: "Histogram Open Bucket Count Tool",
    description:
      "Count finite histogram buckets plus the one conventional unbounded final bucket from strictly increasing finite bounds.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        upperBounds: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
      },
      required: ["upperBounds"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        openBuckets: { type: "integer" },
        finiteBuckets: { type: "integer" },
      },
      required: ["openBuckets", "finiteBuckets"],
    },
    ports: {
      inputs: [
        {
          id: "upperBounds",
          label: "Upper Bounds",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        {
          id: "openBuckets",
          label: "Open Buckets",
          valueType: { type: "integer" },
        },
        {
          id: "finiteBuckets",
          label: "Finite Buckets",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = histogramOpenBucketCountTool.execute;
export default histogramOpenBucketCountTool;
