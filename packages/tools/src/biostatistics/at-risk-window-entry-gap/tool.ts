import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly entry: number;
  readonly windowStart: number;
  readonly windowEnd: number;
  readonly eventOrExit: number;
};
export type Output = {
  readonly eligibleStart: number;
  readonly observedStop: number;
  readonly atRiskDuration: number;
  readonly delayedEntry: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    entry: { type: "number" },
    windowStart: { type: "number" },
    windowEnd: { type: "number" },
    eventOrExit: { type: "number" },
  },
  required: ["entry", "windowStart", "windowEnd", "eventOrExit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eligibleStart: { type: "number" },
    observedStop: { type: "number" },
    atRiskDuration: { type: "number" },
    delayedEntry: { type: "number" },
  },
  required: ["eligibleStart", "observedStop", "atRiskDuration", "delayedEntry"],
} as const;
/** Calculate at risk window entry gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { entry, windowStart, windowEnd, eventOrExit } = request;
  const compute = (): Output => {
    H.domain(windowEnd >= windowStart && eventOrExit >= entry);
    return (() => {
      const eligibleStart = Math.max(entry, windowStart),
        observedStop = Math.min(eventOrExit, windowEnd);
      return {
        eligibleStart,
        observedStop,
        atRiskDuration: Math.max(0, observedStop - eligibleStart),
        delayedEntry: Math.max(0, entry - windowStart),
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { entry: 3, windowStart: 0, windowEnd: 10, eventOrExit: 8 },
  output: {
    eligibleStart: 3,
    observedStop: 8,
    atRiskDuration: 5,
    delayedEntry: 3,
  },
} satisfies ToolExample<Input, Output>;
export const atRiskWindowEntryGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biostatistics/at-risk-window-entry-gap",
    title: "At Risk Window Entry Gap Tool",
    description:
      "Calculate at risk window entry gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        entry: { type: "number" },
        windowStart: { type: "number" },
        windowEnd: { type: "number" },
        eventOrExit: { type: "number" },
      },
      required: ["entry", "windowStart", "windowEnd", "eventOrExit"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eligibleStart: { type: "number" },
        observedStop: { type: "number" },
        atRiskDuration: { type: "number" },
        delayedEntry: { type: "number" },
      },
      required: [
        "eligibleStart",
        "observedStop",
        "atRiskDuration",
        "delayedEntry",
      ],
    },
    ports: {
      inputs: [
        {
          id: "entry",
          label: "Entry",
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
        {
          id: "eventOrExit",
          label: "Event Or Exit",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "eligibleStart",
          label: "Eligible Start",
          valueType: { type: "number" },
        },
        {
          id: "observedStop",
          label: "Observed Stop",
          valueType: { type: "number" },
        },
        {
          id: "atRiskDuration",
          label: "At Risk Duration",
          valueType: { type: "number" },
        },
        {
          id: "delayedEntry",
          label: "Delayed Entry",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = atRiskWindowEntryGapTool.execute;
export default atRiskWindowEntryGapTool;
