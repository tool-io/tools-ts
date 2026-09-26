import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly windowStart: number;
  readonly enteredAt: number;
  readonly windowEnd: number;
};
export type Output = {
  readonly entryOffset: number;
  readonly observedDuration: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    windowStart: { type: "number" },
    enteredAt: { type: "number" },
    windowEnd: { type: "number" },
  },
  required: ["windowStart", "enteredAt", "windowEnd"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    entryOffset: { type: "number" },
    observedDuration: { type: "number" },
  },
  required: ["entryOffset", "observedDuration"],
} as const;
/** Locate supplied left entry on a half-open risk window without imputing events. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { windowStart, enteredAt, windowEnd } = request;
  const compute = (): Output => {
    H.domain(windowEnd >= windowStart);
    return {
      entryOffset: Math.max(0, enteredAt - windowStart),
      observedDuration: Math.max(
        0,
        windowEnd - Math.max(windowStart, enteredAt),
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { windowStart: 10, enteredAt: 15, windowEnd: 30 },
  output: { entryOffset: 5, observedDuration: 15 },
} satisfies ToolExample<Input, Output>;
export const riskWindowLeftEntryOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "epidemiology/risk-window-left-entry-offset",
    title: "Risk Window Left Entry Offset Tool",
    description:
      "Locate supplied left entry on a half-open risk window without imputing events.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        windowStart: { type: "number" },
        enteredAt: { type: "number" },
        windowEnd: { type: "number" },
      },
      required: ["windowStart", "enteredAt", "windowEnd"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        entryOffset: { type: "number" },
        observedDuration: { type: "number" },
      },
      required: ["entryOffset", "observedDuration"],
    },
    ports: {
      inputs: [
        {
          id: "windowStart",
          label: "Window Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "enteredAt",
          label: "Entered At",
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
        {
          id: "entryOffset",
          label: "Entry Offset",
          valueType: { type: "number" },
        },
        {
          id: "observedDuration",
          label: "Observed Duration",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = riskWindowLeftEntryOffsetTool.execute;
export default riskWindowLeftEntryOffsetTool;
