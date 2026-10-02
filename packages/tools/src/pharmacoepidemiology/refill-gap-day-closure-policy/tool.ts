import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly previousLastDay: number;
  readonly nextFirstDay: number;
  readonly countPreviousLast: boolean;
  readonly countNextFirst: boolean;
};
export type Output = { readonly gapDays: number; readonly overlaps: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    previousLastDay: { type: "integer" },
    nextFirstDay: { type: "integer" },
    countPreviousLast: { type: "boolean" },
    countNextFirst: { type: "boolean" },
  },
  required: [
    "previousLastDay",
    "nextFirstDay",
    "countPreviousLast",
    "countNextFirst",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { gapDays: { type: "integer" }, overlaps: { type: "boolean" } },
  required: ["gapDays", "overlaps"],
} as const;
/** Count supplied administrative refill-gap day endpoints without inferring medication use or adherence. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { previousLastDay, nextFirstDay, countPreviousLast, countNextFirst } =
    request;
  const compute = (): Output => {
    return {
      gapDays: Math.max(
        0,
        nextFirstDay -
          previousLastDay -
          1 +
          (countPreviousLast ? 1 : 0) +
          (countNextFirst ? 1 : 0),
      ),
      overlaps: nextFirstDay <= previousLastDay,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    previousLastDay: 10,
    nextFirstDay: 15,
    countPreviousLast: false,
    countNextFirst: false,
  },
  output: { gapDays: 4, overlaps: false },
} satisfies ToolExample<Input, Output>;
export const refillGapDayClosurePolicyTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "pharmacoepidemiology/refill-gap-day-closure-policy",
    title: "Refill Gap Day Closure Policy Tool",
    description:
      "Count supplied administrative refill-gap day endpoints without inferring medication use or adherence.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        previousLastDay: { type: "integer" },
        nextFirstDay: { type: "integer" },
        countPreviousLast: { type: "boolean" },
        countNextFirst: { type: "boolean" },
      },
      required: [
        "previousLastDay",
        "nextFirstDay",
        "countPreviousLast",
        "countNextFirst",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        gapDays: { type: "integer" },
        overlaps: { type: "boolean" },
      },
      required: ["gapDays", "overlaps"],
    },
    ports: {
      inputs: [
        {
          id: "previousLastDay",
          label: "Previous Last Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "nextFirstDay",
          label: "Next First Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "countPreviousLast",
          label: "Count Previous Last",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "countNextFirst",
          label: "Count Next First",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "gapDays", label: "Gap Days", valueType: { type: "integer" } },
        { id: "overlaps", label: "Overlaps", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = refillGapDayClosurePolicyTool.execute;
export default refillGapDayClosurePolicyTool;
