import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstMinutes: number;
  readonly secondMinutes: number;
  readonly sharedMinutes: number;
};
export type Output = {
  readonly uniqueMinutes: number;
  readonly duplicateShare: number;
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
    duplicateShare: { type: "number" },
  },
  required: ["uniqueMinutes", "duplicateShare"],
} as const;
/** Audit overlap in supplied informant coverage windows without merging clinical judgments. */
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
      duplicateShare:
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
  input: { firstMinutes: 40, secondMinutes: 30, sharedMinutes: 10 },
  output: { uniqueMinutes: 60, duplicateShare: 0.14285714285714285 },
} satisfies ToolExample<Input, Output>;
export const informantOverlapTimeBudgetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "psychiatry/informant-overlap-time-budget",
    title: "Informant Overlap Time Budget Tool",
    description:
      "Audit overlap in supplied informant coverage windows without merging clinical judgments.",
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
        duplicateShare: { type: "number" },
      },
      required: ["uniqueMinutes", "duplicateShare"],
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
          id: "duplicateShare",
          label: "Duplicate Share",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = informantOverlapTimeBudgetTool.execute;
export default informantOverlapTimeBudgetTool;
