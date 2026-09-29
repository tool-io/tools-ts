import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly preparedMinute: number;
  readonly servedMinute: number;
  readonly suppliedLimit: number;
};
export type Output = {
  readonly heldMinutes: number;
  readonly remainingMinutes: number;
  readonly withinLimit: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    preparedMinute: { type: "number" },
    servedMinute: { type: "number" },
    suppliedLimit: { type: "number", minimum: 0 },
  },
  required: ["preparedMinute", "servedMinute", "suppliedLimit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    heldMinutes: { type: "number" },
    remainingMinutes: { type: "number" },
    withinLimit: { type: "boolean" },
  },
  required: ["heldMinutes", "remainingMinutes", "withinLimit"],
} as const;
/** Compare an elapsed holding interval with an explicit caller limit; no food-safety rule is selected. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { preparedMinute, servedMinute, suppliedLimit } = request;
  const compute = (): Output => {
    H.domain(servedMinute >= preparedMinute && suppliedLimit >= 0);
    return {
      heldMinutes: servedMinute - preparedMinute,
      remainingMinutes: suppliedLimit - servedMinute + preparedMinute,
      withinLimit: servedMinute - preparedMinute <= suppliedLimit,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { preparedMinute: 30, servedMinute: 75, suppliedLimit: 60 },
  output: { heldMinutes: 45, remainingMinutes: 15, withinLimit: true },
} satisfies ToolExample<Input, Output>;
export const breakfastServiceBatchHoldTimeGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hospitality/breakfast-service-batch-hold-time-gap",
    title: "Breakfast Service Batch Hold Time Gap Tool",
    description:
      "Compare an elapsed holding interval with an explicit caller limit; no food-safety rule is selected.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        preparedMinute: { type: "number" },
        servedMinute: { type: "number" },
        suppliedLimit: { type: "number", minimum: 0 },
      },
      required: ["preparedMinute", "servedMinute", "suppliedLimit"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        heldMinutes: { type: "number" },
        remainingMinutes: { type: "number" },
        withinLimit: { type: "boolean" },
      },
      required: ["heldMinutes", "remainingMinutes", "withinLimit"],
    },
    ports: {
      inputs: [
        {
          id: "preparedMinute",
          label: "Prepared Minute",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "servedMinute",
          label: "Served Minute",
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
        {
          id: "heldMinutes",
          label: "Held Minutes",
          valueType: { type: "number" },
        },
        {
          id: "remainingMinutes",
          label: "Remaining Minutes",
          valueType: { type: "number" },
        },
        {
          id: "withinLimit",
          label: "Within Limit",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = breakfastServiceBatchHoldTimeGapTool.execute;
export default breakfastServiceBatchHoldTimeGapTool;
