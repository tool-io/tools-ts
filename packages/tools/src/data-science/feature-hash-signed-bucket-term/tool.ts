import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly hash: number;
  readonly buckets: number;
  readonly value: number;
};
export type Output = { readonly bucket: number; readonly signedValue: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    hash: { type: "integer", minimum: 0 },
    buckets: { type: "integer", minimum: 1 },
    value: { type: "number" },
  },
  required: ["hash", "buckets", "value"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { bucket: { type: "integer" }, signedValue: { type: "number" } },
  required: ["bucket", "signedValue"],
} as const;
/** Supplied nonnegative hash uses modulo for bucket and parity of the quotient for sign; no hash algorithm is selected. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { hash, buckets, value } = request;
  const compute = (): Output => {
    H.integer(hash, 0);
    H.integer(buckets, 1);
    const h = BigInt(hash),
      divisor = BigInt(buckets);
    return {
      bucket: Number(h % divisor),
      signedValue: ((h / divisor) % 2n === 0n ? 1 : -1) * value,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { hash: 13, buckets: 4, value: 2 },
  output: { bucket: 1, signedValue: -2 },
} satisfies ToolExample<Input, Output>;
export const featureHashSignedBucketTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "data-science/feature-hash-signed-bucket-term",
    title: "Feature Hash Signed Bucket Term Tool",
    description:
      "Supplied nonnegative hash uses modulo for bucket and parity of the quotient for sign; no hash algorithm is selected.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        hash: { type: "integer", minimum: 0 },
        buckets: { type: "integer", minimum: 1 },
        value: { type: "number" },
      },
      required: ["hash", "buckets", "value"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        bucket: { type: "integer" },
        signedValue: { type: "number" },
      },
      required: ["bucket", "signedValue"],
    },
    ports: {
      inputs: [
        {
          id: "hash",
          label: "Hash",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "buckets",
          label: "Buckets",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "value",
          label: "Value",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "bucket", label: "Bucket", valueType: { type: "integer" } },
        {
          id: "signedValue",
          label: "Signed Value",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = featureHashSignedBucketTermTool.execute;
export default featureHashSignedBucketTermTool;
