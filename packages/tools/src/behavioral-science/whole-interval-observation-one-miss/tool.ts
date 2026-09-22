import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observed: readonly boolean[];
  readonly missing: readonly boolean[];
};
export type Output = {
  readonly completeObservation: boolean;
  readonly wholeInterval: boolean;
  readonly misses: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observed: { type: "array", maxItems: 256, items: { type: "boolean" } },
    missing: { type: "array", maxItems: 256, items: { type: "boolean" } },
  },
  required: ["observed", "missing"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    completeObservation: { type: "boolean" },
    wholeInterval: { type: "boolean" },
    misses: { type: "integer" },
  },
  required: ["completeObservation", "wholeInterval", "misses"],
} as const;
/** Whole-interval occurrence requires complete observation and no sampled miss; missing samples cannot establish whole-interval occurrence. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observed, missing } = request;
  const compute = (): Output => {
    H.sameLength(observed, missing);
    const completeObservation = observed.length > 0 && missing.every((x) => !x);
    return {
      completeObservation,
      wholeInterval: completeObservation && observed.every(Boolean),
      misses: observed.filter((x, i) => !missing[i] && !x).length,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { observed: [true, false, true], missing: [false, false, false] },
  output: { completeObservation: true, wholeInterval: false, misses: 1 },
} satisfies ToolExample<Input, Output>;
export const wholeIntervalObservationOneMissTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "behavioral-science/whole-interval-observation-one-miss",
    title: "Whole Interval Observation One Miss Tool",
    description:
      "Whole-interval occurrence requires complete observation and no sampled miss; missing samples cannot establish whole-interval occurrence.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observed: { type: "array", maxItems: 256, items: { type: "boolean" } },
        missing: { type: "array", maxItems: 256, items: { type: "boolean" } },
      },
      required: ["observed", "missing"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        completeObservation: { type: "boolean" },
        wholeInterval: { type: "boolean" },
        misses: { type: "integer" },
      },
      required: ["completeObservation", "wholeInterval", "misses"],
    },
    ports: {
      inputs: [
        {
          id: "observed",
          label: "Observed",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "missing",
          label: "Missing",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "completeObservation",
          label: "Complete Observation",
          valueType: { type: "boolean" },
        },
        {
          id: "wholeInterval",
          label: "Whole Interval",
          valueType: { type: "boolean" },
        },
        { id: "misses", label: "Misses", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = wholeIntervalObservationOneMissTool.execute;
export default wholeIntervalObservationOneMissTool;
