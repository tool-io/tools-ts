import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly targetLength: number;
  readonly wetToDryRetention: number;
  readonly dryToFiredRetention: number;
};
export type Output = {
  readonly wetLength: number;
  readonly dryLength: number;
  readonly totalRetention: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    targetLength: { type: "number", minimum: 0 },
    wetToDryRetention: { type: "number", exclusiveMinimum: 0, maximum: 1 },
    dryToFiredRetention: { type: "number", exclusiveMinimum: 0, maximum: 1 },
  },
  required: ["targetLength", "wetToDryRetention", "dryToFiredRetention"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    wetLength: { type: "number" },
    dryLength: { type: "number" },
    totalRetention: { type: "number" },
  },
  required: ["wetLength", "dryLength", "totalRetention"],
} as const;
/** Two sequential linear retention stages, without selecting a clay body or firing schedule. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { targetLength, wetToDryRetention, dryToFiredRetention } = request;
  const compute = (): Output => {
    H.domain(
      targetLength >= 0 &&
        wetToDryRetention > 0 &&
        wetToDryRetention <= 1 &&
        dryToFiredRetention > 0 &&
        dryToFiredRetention <= 1,
    );
    return {
      wetLength: targetLength / (wetToDryRetention * dryToFiredRetention),
      dryLength: targetLength / dryToFiredRetention,
      totalRetention: wetToDryRetention * dryToFiredRetention,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { targetLength: 72, wetToDryRetention: 0.9, dryToFiredRetention: 0.8 },
  output: {
    wetLength: 99.99999999999999,
    dryLength: 90,
    totalRetention: 0.7200000000000001,
  },
} satisfies ToolExample<Input, Output>;
export const clayClassShrinkageMarkCompensationTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "art-education/clay-class-shrinkage-mark-compensation",
    title: "Clay Class Shrinkage Mark Compensation Tool",
    description:
      "Two sequential linear retention stages, without selecting a clay body or firing schedule.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        targetLength: { type: "number", minimum: 0 },
        wetToDryRetention: { type: "number", exclusiveMinimum: 0, maximum: 1 },
        dryToFiredRetention: {
          type: "number",
          exclusiveMinimum: 0,
          maximum: 1,
        },
      },
      required: ["targetLength", "wetToDryRetention", "dryToFiredRetention"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        wetLength: { type: "number" },
        dryLength: { type: "number" },
        totalRetention: { type: "number" },
      },
      required: ["wetLength", "dryLength", "totalRetention"],
    },
    ports: {
      inputs: [
        {
          id: "targetLength",
          label: "Target Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "wetToDryRetention",
          label: "Wet To Dry Retention",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "dryToFiredRetention",
          label: "Dry To Fired Retention",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "wetLength", label: "Wet Length", valueType: { type: "number" } },
        { id: "dryLength", label: "Dry Length", valueType: { type: "number" } },
        {
          id: "totalRetention",
          label: "Total Retention",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = clayClassShrinkageMarkCompensationTool.execute;
export default clayClassShrinkageMarkCompensationTool;
