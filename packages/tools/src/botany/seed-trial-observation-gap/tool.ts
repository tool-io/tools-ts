import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly scheduledTimes: readonly number[];
  readonly observedTimes: readonly number[];
  readonly matched: readonly boolean[];
};
export type Output = {
  readonly matchedVisits: number;
  readonly missedVisits: number;
  readonly meanTimingGap: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    scheduledTimes: { type: "array", maxItems: 256, items: { type: "number" } },
    observedTimes: { type: "array", maxItems: 256, items: { type: "number" } },
    matched: { type: "array", maxItems: 256, items: { type: "boolean" } },
  },
  required: ["scheduledTimes", "observedTimes", "matched"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    matchedVisits: { type: "integer" },
    missedVisits: { type: "integer" },
    meanTimingGap: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["matchedVisits", "missedVisits", "meanTimingGap", "defined"],
} as const;
/** Calculate seed trial observation gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { scheduledTimes, observedTimes, matched } = request;
  const compute = (): Output => {
    H.sameLength(scheduledTimes, observedTimes);
    H.sameLength(scheduledTimes, matched);
    return (() => {
      const matchedVisits = matched.filter(Boolean).length,
        sum = scheduledTimes.reduce(
          (s, x, i) => s + (matched[i] ? observedTimes[i] - x : 0),
          0,
        );
      return {
        matchedVisits,
        missedVisits: matched.length - matchedVisits,
        meanTimingGap: matchedVisits > 0 ? sum / matchedVisits : 0,
        defined: matchedVisits > 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    scheduledTimes: [1, 2, 3],
    observedTimes: [1.2, 2.5, 0],
    matched: [true, true, false],
  },
  output: {
    matchedVisits: 2,
    missedVisits: 1,
    meanTimingGap: 0.35,
    defined: true,
  },
} satisfies ToolExample<Input, Output>;
export const seedTrialObservationGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "botany/seed-trial-observation-gap",
    title: "Seed Trial Observation Gap Tool",
    description:
      "Calculate seed trial observation gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        scheduledTimes: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        observedTimes: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        matched: { type: "array", maxItems: 256, items: { type: "boolean" } },
      },
      required: ["scheduledTimes", "observedTimes", "matched"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        matchedVisits: { type: "integer" },
        missedVisits: { type: "integer" },
        meanTimingGap: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["matchedVisits", "missedVisits", "meanTimingGap", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "scheduledTimes",
          label: "Scheduled Times",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "observedTimes",
          label: "Observed Times",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "matched",
          label: "Matched",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "matchedVisits",
          label: "Matched Visits",
          valueType: { type: "integer" },
        },
        {
          id: "missedVisits",
          label: "Missed Visits",
          valueType: { type: "integer" },
        },
        {
          id: "meanTimingGap",
          label: "Mean Timing Gap",
          valueType: { type: "number" },
        },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = seedTrialObservationGapTool.execute;
export default seedTrialObservationGapTool;
