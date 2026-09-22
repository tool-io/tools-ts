import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observed: readonly boolean[];
  readonly missing: readonly boolean[];
};
export type Output = {
  readonly scorable: boolean;
  readonly occurred: boolean;
  readonly observedSamples: number;
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
    scorable: { type: "boolean" },
    occurred: { type: "boolean" },
    observedSamples: { type: "integer" },
  },
  required: ["scorable", "occurred", "observedSamples"],
} as const;
/** Any occurrence within the nonmissing supplied samples; scorable=false preserves an entirely missing interval. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observed, missing } = request;
  const compute = (): Output => {
    H.sameLength(observed, missing);
    const values = observed.filter((_, i) => !missing[i]);
    return {
      scorable: values.length > 0,
      occurred: values.some(Boolean),
      observedSamples: values.length,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { observed: [false, true, false], missing: [false, false, true] },
  output: { scorable: true, occurred: true, observedSamples: 2 },
} satisfies ToolExample<Input, Output>;
export const partialIntervalObservationOneHitTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "behavioral-science/partial-interval-observation-one-hit",
    title: "Partial Interval Observation One Hit Tool",
    description:
      "Any occurrence within the nonmissing supplied samples; scorable=false preserves an entirely missing interval.",
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
        scorable: { type: "boolean" },
        occurred: { type: "boolean" },
        observedSamples: { type: "integer" },
      },
      required: ["scorable", "occurred", "observedSamples"],
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
        { id: "scorable", label: "Scorable", valueType: { type: "boolean" } },
        { id: "occurred", label: "Occurred", valueType: { type: "boolean" } },
        {
          id: "observedSamples",
          label: "Observed Samples",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = partialIntervalObservationOneHitTool.execute;
export default partialIntervalObservationOneHitTool;
