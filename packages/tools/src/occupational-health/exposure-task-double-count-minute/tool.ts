import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstMinutes: number;
  readonly secondMinutes: number;
  readonly sharedMinutes: number;
};
export type Output = {
  readonly uniqueMinutes: number;
  readonly naiveMinutes: number;
  readonly overlapFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstMinutes: { type: "number", minimum: 0 },
    secondMinutes: { type: "number", minimum: 0 },
    sharedMinutes: { type: "number", minimum: 0 },
  },
  required: ["firstMinutes", "secondMinutes", "sharedMinutes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    uniqueMinutes: { type: "number" },
    naiveMinutes: { type: "number" },
    overlapFraction: { type: "number" },
  },
  required: ["uniqueMinutes", "naiveMinutes", "overlapFraction"],
} as const;
/** Remove supplied duplicate task minutes without assessing exposure safety. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstMinutes, secondMinutes, sharedMinutes } = request;
  const compute = (): Output => {
    H.domain(
      firstMinutes >= 0 &&
        secondMinutes >= 0 &&
        sharedMinutes >= 0 &&
        sharedMinutes <= Math.min(firstMinutes, secondMinutes),
    );
    return {
      uniqueMinutes: firstMinutes + secondMinutes - sharedMinutes,
      naiveMinutes: firstMinutes + secondMinutes,
      overlapFraction:
        firstMinutes + secondMinutes > 0
          ? sharedMinutes / (firstMinutes + secondMinutes)
          : 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstMinutes: 30, secondMinutes: 40, sharedMinutes: 10 },
  output: {
    uniqueMinutes: 60,
    naiveMinutes: 70,
    overlapFraction: 0.14285714285714285,
  },
} satisfies ToolExample<Input, Output>;
export const exposureTaskDoubleCountMinuteTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "occupational-health/exposure-task-double-count-minute",
    title: "Exposure Task Double Count Minute Tool",
    description:
      "Remove supplied duplicate task minutes without assessing exposure safety.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstMinutes: { type: "number", minimum: 0 },
        secondMinutes: { type: "number", minimum: 0 },
        sharedMinutes: { type: "number", minimum: 0 },
      },
      required: ["firstMinutes", "secondMinutes", "sharedMinutes"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        uniqueMinutes: { type: "number" },
        naiveMinutes: { type: "number" },
        overlapFraction: { type: "number" },
      },
      required: ["uniqueMinutes", "naiveMinutes", "overlapFraction"],
    },
    ports: {
      inputs: [
        {
          id: "firstMinutes",
          label: "First Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondMinutes",
          label: "Second Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sharedMinutes",
          label: "Shared Minutes",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "uniqueMinutes",
          label: "Unique Minutes",
          valueType: { type: "number" },
        },
        {
          id: "naiveMinutes",
          label: "Naive Minutes",
          valueType: { type: "number" },
        },
        {
          id: "overlapFraction",
          label: "Overlap Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = exposureTaskDoubleCountMinuteTool.execute;
export default exposureTaskDoubleCountMinuteTool;
