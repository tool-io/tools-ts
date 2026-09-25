import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstValue: number;
  readonly secondValue: number;
  readonly firstSign: number;
  readonly secondSign: number;
  readonly sameBucket: boolean;
};
export type Output = {
  readonly combinedBucketValue: number;
  readonly crossTerm: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstValue: { type: "number" },
    secondValue: { type: "number" },
    firstSign: { type: "integer" },
    secondSign: { type: "integer" },
    sameBucket: { type: "boolean" },
  },
  required: [
    "firstValue",
    "secondValue",
    "firstSign",
    "secondSign",
    "sameBucket",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    combinedBucketValue: { type: "number" },
    crossTerm: { type: "number" },
  },
  required: ["combinedBucketValue", "crossTerm"],
} as const;
/** Feature-hashing collision contribution; combined value is unused when supplied buckets differ. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstValue, secondValue, firstSign, secondSign, sameBucket } =
    request;
  const compute = (): Output => {
    H.domain([1, -1].includes(firstSign) && [1, -1].includes(secondSign));
    return {
      combinedBucketValue: sameBucket
        ? firstSign * firstValue + secondSign * secondValue
        : 0,
      crossTerm: sameBucket
        ? 2 * firstSign * secondSign * firstValue * secondValue
        : 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstValue: 2,
    secondValue: 3,
    firstSign: 1,
    secondSign: -1,
    sameBucket: true,
  },
  output: { combinedBucketValue: -1, crossTerm: -12 },
} satisfies ToolExample<Input, Output>;
export const hashBucketSignCollisionTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "data-science/hash-bucket-sign-collision-term",
    title: "Hash Bucket Sign Collision Term Tool",
    description:
      "Feature-hashing collision contribution; combined value is unused when supplied buckets differ.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstValue: { type: "number" },
        secondValue: { type: "number" },
        firstSign: { type: "integer" },
        secondSign: { type: "integer" },
        sameBucket: { type: "boolean" },
      },
      required: [
        "firstValue",
        "secondValue",
        "firstSign",
        "secondSign",
        "sameBucket",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        combinedBucketValue: { type: "number" },
        crossTerm: { type: "number" },
      },
      required: ["combinedBucketValue", "crossTerm"],
    },
    ports: {
      inputs: [
        {
          id: "firstValue",
          label: "First Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondValue",
          label: "Second Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "firstSign",
          label: "First Sign",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "secondSign",
          label: "Second Sign",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "sameBucket",
          label: "Same Bucket",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "combinedBucketValue",
          label: "Combined Bucket Value",
          valueType: { type: "number" },
        },
        { id: "crossTerm", label: "Cross Term", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = hashBucketSignCollisionTermTool.execute;
export default hashBucketSignCollisionTermTool;
