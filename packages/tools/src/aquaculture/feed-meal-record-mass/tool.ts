import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly containerBeforeKg: number;
  readonly containerAfterKg: number;
  readonly spilledKg: number;
};
export type Output = {
  readonly withdrawnKg: number;
  readonly deliveredKg: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    containerBeforeKg: { type: "number", minimum: 0 },
    containerAfterKg: { type: "number", minimum: 0 },
    spilledKg: { type: "number", minimum: 0 },
  },
  required: ["containerBeforeKg", "containerAfterKg", "spilledKg"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    withdrawnKg: { type: "number" },
    deliveredKg: { type: "number" },
  },
  required: ["withdrawnKg", "deliveredKg"],
} as const;
/** Balance one recorded feed meal from before/after container mass and separately measured spillage; no ration is prescribed. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { containerBeforeKg, containerAfterKg, spilledKg } = request;
  const compute = (): Output => {
    H.domain(
      containerBeforeKg >= 0 &&
        containerAfterKg >= 0 &&
        containerAfterKg <= containerBeforeKg &&
        spilledKg >= 0 &&
        spilledKg <= containerBeforeKg - containerAfterKg,
      "containerBeforeKg",
    );
    return {
      withdrawnKg: containerBeforeKg - containerAfterKg,
      deliveredKg: containerBeforeKg - containerAfterKg - spilledKg,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { containerBeforeKg: 12, containerAfterKg: 10.5, spilledKg: 0.1 },
  output: { withdrawnKg: 1.5, deliveredKg: 1.4 },
} satisfies ToolExample<Input, Output>;
export const feedMealRecordMassTool = H.defineSchemaCalculation<Input, Output>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["aquaculture", "agriculture"],
      keywords: ["aquaculture", "agriculture"],
    },
    id: "aquaculture/feed-meal-record-mass",
    title: "Feed Meal Record Mass",
    description:
      "Balance one recorded feed meal from before/after container mass and separately measured spillage; no ration is prescribed.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        containerBeforeKg: { type: "number", minimum: 0 },
        containerAfterKg: { type: "number", minimum: 0 },
        spilledKg: { type: "number", minimum: 0 },
      },
      required: ["containerBeforeKg", "containerAfterKg", "spilledKg"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        withdrawnKg: { type: "number" },
        deliveredKg: { type: "number" },
      },
      required: ["withdrawnKg", "deliveredKg"],
    },
    ports: {
      inputs: [
        {
          id: "containerBeforeKg",
          label: "Container Before Kg",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "containerAfterKg",
          label: "Container After Kg",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "spilledKg",
          label: "Spilled Kg",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "withdrawnKg",
          label: "Withdrawn Kg",
          valueType: { type: "number" },
        },
        {
          id: "deliveredKg",
          label: "Delivered Kg",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = feedMealRecordMassTool.execute;
export default feedMealRecordMassTool;
