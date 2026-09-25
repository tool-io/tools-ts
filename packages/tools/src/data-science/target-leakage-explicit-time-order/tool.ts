import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly featureAvailable: number;
  readonly predictionTime: number;
  readonly targetObserved: number;
  readonly allowSimultaneous: boolean;
};
export type Output = {
  readonly featureEligible: boolean;
  readonly targetInFuture: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    featureAvailable: { type: "number" },
    predictionTime: { type: "number" },
    targetObserved: { type: "number" },
    allowSimultaneous: { type: "boolean" },
  },
  required: [
    "featureAvailable",
    "predictionTime",
    "targetObserved",
    "allowSimultaneous",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    featureEligible: { type: "boolean" },
    targetInFuture: { type: "boolean" },
  },
  required: ["featureEligible", "targetInFuture"],
} as const;
/** One explicit availability-time audit; this does not establish absence of all target leakage. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    featureAvailable,
    predictionTime,
    targetObserved,
    allowSimultaneous,
  } = request;
  const compute = (): Output => {
    return {
      featureEligible: allowSimultaneous
        ? featureAvailable <= predictionTime
        : featureAvailable < predictionTime,
      targetInFuture: targetObserved > predictionTime,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    featureAvailable: 9,
    predictionTime: 10,
    targetObserved: 12,
    allowSimultaneous: false,
  },
  output: { featureEligible: true, targetInFuture: true },
} satisfies ToolExample<Input, Output>;
export const targetLeakageExplicitTimeOrderTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "data-science/target-leakage-explicit-time-order",
    title: "Target Leakage Explicit Time Order Tool",
    description:
      "One explicit availability-time audit; this does not establish absence of all target leakage.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        featureAvailable: { type: "number" },
        predictionTime: { type: "number" },
        targetObserved: { type: "number" },
        allowSimultaneous: { type: "boolean" },
      },
      required: [
        "featureAvailable",
        "predictionTime",
        "targetObserved",
        "allowSimultaneous",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        featureEligible: { type: "boolean" },
        targetInFuture: { type: "boolean" },
      },
      required: ["featureEligible", "targetInFuture"],
    },
    ports: {
      inputs: [
        {
          id: "featureAvailable",
          label: "Feature Available",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "predictionTime",
          label: "Prediction Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "targetObserved",
          label: "Target Observed",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "allowSimultaneous",
          label: "Allow Simultaneous",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "featureEligible",
          label: "Feature Eligible",
          valueType: { type: "boolean" },
        },
        {
          id: "targetInFuture",
          label: "Target In Future",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = targetLeakageExplicitTimeOrderTool.execute;
export default targetLeakageExplicitTimeOrderTool;
