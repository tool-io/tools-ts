import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly collectionTime: number;
  readonly analysisTime: number;
  readonly suppliedLimit: number;
};
export type Output = {
  readonly elapsed: number;
  readonly margin: number;
  readonly withinSuppliedLimit: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    collectionTime: { type: "number" },
    analysisTime: { type: "number" },
    suppliedLimit: { type: "number", minimum: 0 },
  },
  required: ["collectionTime", "analysisTime", "suppliedLimit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    elapsed: { type: "number" },
    margin: { type: "number" },
    withinSuppliedLimit: { type: "boolean" },
  },
  required: ["elapsed", "margin", "withinSuppliedLimit"],
} as const;
/** Elapsed-time bookkeeping against an explicitly supplied limit. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { collectionTime, analysisTime, suppliedLimit } = request;
  const compute = (): Output => {
    H.domain(analysisTime >= collectionTime && suppliedLimit >= 0);
    return {
      elapsed: analysisTime - collectionTime,
      margin: suppliedLimit - (analysisTime - collectionTime),
      withinSuppliedLimit: analysisTime - collectionTime <= suppliedLimit,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { collectionTime: 100, analysisTime: 160, suppliedLimit: 90 },
  output: { elapsed: 60, margin: 30, withinSuppliedLimit: true },
} satisfies ToolExample<Input, Output>;
export const foodSampleHoldingTimeCallerMarginTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "food-safety/food-sample-holding-time-caller-margin",
    title: "Food Sample Holding Time Caller Margin Tool",
    description:
      "Elapsed-time bookkeeping against an explicitly supplied limit.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        collectionTime: { type: "number" },
        analysisTime: { type: "number" },
        suppliedLimit: { type: "number", minimum: 0 },
      },
      required: ["collectionTime", "analysisTime", "suppliedLimit"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        elapsed: { type: "number" },
        margin: { type: "number" },
        withinSuppliedLimit: { type: "boolean" },
      },
      required: ["elapsed", "margin", "withinSuppliedLimit"],
    },
    ports: {
      inputs: [
        {
          id: "collectionTime",
          label: "Collection Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "analysisTime",
          label: "Analysis Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedLimit",
          label: "Supplied Limit",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "elapsed", label: "Elapsed", valueType: { type: "number" } },
        { id: "margin", label: "Margin", valueType: { type: "number" } },
        {
          id: "withinSuppliedLimit",
          label: "Within Supplied Limit",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = foodSampleHoldingTimeCallerMarginTool.execute;
export default foodSampleHoldingTimeCallerMarginTool;
