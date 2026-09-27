import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly trialCount: number;
  readonly activeSecondsPerTrial: number;
  readonly restSeconds: number;
  readonly elapsedSessionSeconds: number;
};
export type Output = {
  readonly activeSeconds: number;
  readonly activeFraction: number;
  readonly unaccountedSeconds: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    trialCount: { type: "integer", minimum: 0 },
    activeSecondsPerTrial: { type: "number", minimum: 0 },
    restSeconds: { type: "number", minimum: 0 },
    elapsedSessionSeconds: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "trialCount",
    "activeSecondsPerTrial",
    "restSeconds",
    "elapsedSessionSeconds",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    activeSeconds: { type: "number" },
    activeFraction: { type: "number" },
    unaccountedSeconds: { type: "number" },
  },
  required: ["activeSeconds", "activeFraction", "unaccountedSeconds"],
} as const;
/** Exposure accounting with no inferred psychological fatigue score. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    trialCount,
    activeSecondsPerTrial,
    restSeconds,
    elapsedSessionSeconds,
  } = request;
  const compute = (): Output => {
    H.integer(trialCount, 0);
    H.domain(
      activeSecondsPerTrial >= 0 &&
        restSeconds >= 0 &&
        trialCount * activeSecondsPerTrial + restSeconds <=
          elapsedSessionSeconds,
    );
    H.positive(elapsedSessionSeconds);
    return {
      activeSeconds: trialCount * activeSecondsPerTrial,
      activeFraction:
        (trialCount * activeSecondsPerTrial) / elapsedSessionSeconds,
      unaccountedSeconds:
        elapsedSessionSeconds -
        trialCount * activeSecondsPerTrial -
        restSeconds,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    trialCount: 100,
    activeSecondsPerTrial: 2,
    restSeconds: 100,
    elapsedSessionSeconds: 400,
  },
  output: { activeSeconds: 200, activeFraction: 0.5, unaccountedSeconds: 100 },
} satisfies ToolExample<Input, Output>;
export const experimentalSessionFatigueExposureTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "experimental-psychology/experimental-session-fatigue-exposure-term",
      title: "Experimental Session Fatigue Exposure Term Tool",
      description:
        "Exposure accounting with no inferred psychological fatigue score.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          trialCount: { type: "integer", minimum: 0 },
          activeSecondsPerTrial: { type: "number", minimum: 0 },
          restSeconds: { type: "number", minimum: 0 },
          elapsedSessionSeconds: { type: "number", exclusiveMinimum: 0 },
        },
        required: [
          "trialCount",
          "activeSecondsPerTrial",
          "restSeconds",
          "elapsedSessionSeconds",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          activeSeconds: { type: "number" },
          activeFraction: { type: "number" },
          unaccountedSeconds: { type: "number" },
        },
        required: ["activeSeconds", "activeFraction", "unaccountedSeconds"],
      },
      ports: {
        inputs: [
          {
            id: "trialCount",
            label: "Trial Count",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "activeSecondsPerTrial",
            label: "Active Seconds Per Trial",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "restSeconds",
            label: "Rest Seconds",
            required: true,
            valueType: { type: "number", unit: "s" },
          },
          {
            id: "elapsedSessionSeconds",
            label: "Elapsed Session Seconds",
            required: true,
            valueType: { type: "number", unit: "s" },
          },
        ],
        outputs: [
          {
            id: "activeSeconds",
            label: "Active Seconds",
            valueType: { type: "number", unit: "s" },
          },
          {
            id: "activeFraction",
            label: "Active Fraction",
            valueType: { type: "number" },
          },
          {
            id: "unaccountedSeconds",
            label: "Unaccounted Seconds",
            valueType: { type: "number", unit: "s" },
          },
        ],
      },
    },
    calculate,
  });
export const run = experimentalSessionFatigueExposureTermTool.execute;
export default experimentalSessionFatigueExposureTermTool;
