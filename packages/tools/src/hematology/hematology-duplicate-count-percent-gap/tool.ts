import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstCount: number;
  readonly secondCount: number;
};
export type Output = {
  readonly meanCount: number;
  readonly signedPercentDifference: number;
  readonly absolutePercentDifference: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstCount: { type: "number", minimum: 0 },
    secondCount: { type: "number", minimum: 0 },
  },
  required: ["firstCount", "secondCount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    meanCount: { type: "number" },
    signedPercentDifference: { type: "number" },
    absolutePercentDifference: { type: "number" },
  },
  required: [
    "meanCount",
    "signedPercentDifference",
    "absolutePercentDifference",
  ],
} as const;
/** Mean-denominator duplicate relative percent difference; no laboratory repeatability acceptance threshold is chosen. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstCount, secondCount } = request;
  const compute = (): Output => {
    H.domain(
      firstCount >= 0 && secondCount >= 0 && firstCount + secondCount > 0,
    );
    return {
      meanCount: (firstCount + secondCount) / 2,
      signedPercentDifference:
        (200 * (secondCount - firstCount)) / (firstCount + secondCount),
      absolutePercentDifference:
        (200 * Math.abs(secondCount - firstCount)) / (firstCount + secondCount),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstCount: 90, secondCount: 110 },
  output: {
    meanCount: 100,
    signedPercentDifference: 20,
    absolutePercentDifference: 20,
  },
} satisfies ToolExample<Input, Output>;
export const hematologyDuplicateCountPercentGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hematology/hematology-duplicate-count-percent-gap",
    title: "Hematology Duplicate Count Percent Gap Tool",
    description:
      "Mean-denominator duplicate relative percent difference; no laboratory repeatability acceptance threshold is chosen.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstCount: { type: "number", minimum: 0 },
        secondCount: { type: "number", minimum: 0 },
      },
      required: ["firstCount", "secondCount"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        meanCount: { type: "number" },
        signedPercentDifference: { type: "number" },
        absolutePercentDifference: { type: "number" },
      },
      required: [
        "meanCount",
        "signedPercentDifference",
        "absolutePercentDifference",
      ],
    },
    ports: {
      inputs: [
        {
          id: "firstCount",
          label: "First Count",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondCount",
          label: "Second Count",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "meanCount", label: "Mean Count", valueType: { type: "number" } },
        {
          id: "signedPercentDifference",
          label: "Signed Percent Difference",
          valueType: { type: "number" },
        },
        {
          id: "absolutePercentDifference",
          label: "Absolute Percent Difference",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = hematologyDuplicateCountPercentGapTool.execute;
export default hematologyDuplicateCountPercentGapTool;
