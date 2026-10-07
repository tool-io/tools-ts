import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observationComplete: boolean;
  readonly occurrenceObserved: boolean;
};
export type Output = {
  readonly codedOccurrence: boolean;
  readonly missing: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observationComplete: { type: "boolean" },
    occurrenceObserved: { type: "boolean" },
  },
  required: ["observationComplete", "occurrenceObserved"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    codedOccurrence: { type: "boolean" },
    missing: { type: "boolean" },
  },
  required: ["codedOccurrence", "missing"],
} as const;
/** Keep an incomplete observation interval separate from an observed event absence using an explicit completeness flag. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observationComplete, occurrenceObserved } = request;
  const compute = (): Output => {
    return {
      codedOccurrence: observationComplete && occurrenceObserved,
      missing: !observationComplete,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { observationComplete: true, occurrenceObserved: true },
  output: { codedOccurrence: true, missing: false },
} satisfies ToolExample<Input, Output>;
export const observationIntervalOccurrenceFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["behavioral-science", "behavioral science", "psychology"],
      keywords: ["behavioral science", "psychology"],
    },
    id: "behavioral-science/observation-interval-occurrence-flag",
    title: "Observation Interval Occurrence Flag",
    description:
      "Keep an incomplete observation interval separate from an observed event absence using an explicit completeness flag.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observationComplete: { type: "boolean" },
        occurrenceObserved: { type: "boolean" },
      },
      required: ["observationComplete", "occurrenceObserved"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        codedOccurrence: { type: "boolean" },
        missing: { type: "boolean" },
      },
      required: ["codedOccurrence", "missing"],
    },
    ports: {
      inputs: [
        {
          id: "observationComplete",
          label: "Observation Complete",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "occurrenceObserved",
          label: "Occurrence Observed",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "codedOccurrence",
          label: "Coded Occurrence",
          valueType: { type: "boolean" },
        },
        { id: "missing", label: "Missing", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = observationIntervalOccurrenceFlagTool.execute;
export default observationIntervalOccurrenceFlagTool;
