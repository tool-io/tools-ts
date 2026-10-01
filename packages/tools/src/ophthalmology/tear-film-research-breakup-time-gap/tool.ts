import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly blinkEndSeconds: number;
  readonly firstObservedBreakSeconds: number;
  readonly lastIntactSeconds: number;
};
export type Output = {
  readonly observedDelay: number;
  readonly lowerDelayBound: number;
  readonly intervalWidth: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    blinkEndSeconds: { type: "number" },
    firstObservedBreakSeconds: { type: "number" },
    lastIntactSeconds: { type: "number" },
  },
  required: [
    "blinkEndSeconds",
    "firstObservedBreakSeconds",
    "lastIntactSeconds",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedDelay: { type: "number" },
    lowerDelayBound: { type: "number" },
    intervalWidth: { type: "number" },
  },
  required: ["observedDelay", "lowerDelayBound", "intervalWidth"],
} as const;
/** Research event-time interval from supplied blink and image observations, without detecting tear-film breakup or applying a clinical cutoff. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { blinkEndSeconds, firstObservedBreakSeconds, lastIntactSeconds } =
    request;
  const compute = (): Output => {
    H.domain(
      lastIntactSeconds >= blinkEndSeconds &&
        firstObservedBreakSeconds >= lastIntactSeconds,
    );
    return {
      observedDelay: firstObservedBreakSeconds - blinkEndSeconds,
      lowerDelayBound: lastIntactSeconds - blinkEndSeconds,
      intervalWidth: firstObservedBreakSeconds - lastIntactSeconds,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    blinkEndSeconds: 1,
    firstObservedBreakSeconds: 8,
    lastIntactSeconds: 7,
  },
  output: { observedDelay: 7, lowerDelayBound: 6, intervalWidth: 1 },
} satisfies ToolExample<Input, Output>;
export const tearFilmResearchBreakupTimeGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "ophthalmology/tear-film-research-breakup-time-gap",
    title: "Tear Film Research Breakup Time Gap Tool",
    description:
      "Research event-time interval from supplied blink and image observations, without detecting tear-film breakup or applying a clinical cutoff.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        blinkEndSeconds: { type: "number" },
        firstObservedBreakSeconds: { type: "number" },
        lastIntactSeconds: { type: "number" },
      },
      required: [
        "blinkEndSeconds",
        "firstObservedBreakSeconds",
        "lastIntactSeconds",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observedDelay: { type: "number" },
        lowerDelayBound: { type: "number" },
        intervalWidth: { type: "number" },
      },
      required: ["observedDelay", "lowerDelayBound", "intervalWidth"],
    },
    ports: {
      inputs: [
        {
          id: "blinkEndSeconds",
          label: "Blink End Seconds",
          required: true,
          valueType: { type: "number", unit: "s" },
        },
        {
          id: "firstObservedBreakSeconds",
          label: "First Observed Break Seconds",
          required: true,
          valueType: { type: "number", unit: "s" },
        },
        {
          id: "lastIntactSeconds",
          label: "Last Intact Seconds",
          required: true,
          valueType: { type: "number", unit: "s" },
        },
      ],
      outputs: [
        {
          id: "observedDelay",
          label: "Observed Delay",
          valueType: { type: "number" },
        },
        {
          id: "lowerDelayBound",
          label: "Lower Delay Bound",
          valueType: { type: "number" },
        },
        {
          id: "intervalWidth",
          label: "Interval Width",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = tearFilmResearchBreakupTimeGapTool.execute;
export default tearFilmResearchBreakupTimeGapTool;
