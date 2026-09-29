import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly commuteStart: number;
  readonly commuteEnd: number;
  readonly windowStart: number;
  readonly windowEnd: number;
};
export type Output = { readonly overlap: number; readonly fraction: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    commuteStart: { type: "number" },
    commuteEnd: { type: "number" },
    windowStart: { type: "number" },
    windowEnd: { type: "number" },
  },
  required: ["commuteStart", "commuteEnd", "windowStart", "windowEnd"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { overlap: { type: "number" }, fraction: { type: "number" } },
  required: ["overlap", "fraction"],
} as const;
/** Time overlap with a supplied commute window without inferring environmental exposure intensity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { commuteStart, commuteEnd, windowStart, windowEnd } = request;
  const compute = (): Output => {
    H.domain(commuteStart < commuteEnd && windowStart <= windowEnd);
    return {
      overlap: Math.max(
        0,
        Math.min(commuteEnd, windowEnd) - Math.max(commuteStart, windowStart),
      ),
      fraction:
        Math.max(
          0,
          Math.min(commuteEnd, windowEnd) - Math.max(commuteStart, windowStart),
        ) /
        (commuteEnd - commuteStart),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { commuteStart: 0, commuteEnd: 100, windowStart: 20, windowEnd: 80 },
  output: { overlap: 60, fraction: 0.6 },
} satisfies ToolExample<Input, Output>;
export const commuteWindowExposureFractionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "human-geography/commute-window-exposure-fraction",
    title: "Commute Window Exposure Fraction Tool",
    description:
      "Time overlap with a supplied commute window without inferring environmental exposure intensity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        commuteStart: { type: "number" },
        commuteEnd: { type: "number" },
        windowStart: { type: "number" },
        windowEnd: { type: "number" },
      },
      required: ["commuteStart", "commuteEnd", "windowStart", "windowEnd"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { overlap: { type: "number" }, fraction: { type: "number" } },
      required: ["overlap", "fraction"],
    },
    ports: {
      inputs: [
        {
          id: "commuteStart",
          label: "Commute Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "commuteEnd",
          label: "Commute End",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "windowStart",
          label: "Window Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "windowEnd",
          label: "Window End",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "overlap", label: "Overlap", valueType: { type: "number" } },
        { id: "fraction", label: "Fraction", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = commuteWindowExposureFractionTool.execute;
export default commuteWindowExposureFractionTool;
