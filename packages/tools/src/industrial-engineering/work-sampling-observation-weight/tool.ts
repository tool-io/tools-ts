import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly representedDuration: number;
  readonly observationCount: number;
};
export type Output = { readonly durationPerObservation: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    representedDuration: { type: "number", minimum: 0 },
    observationCount: { type: "integer", minimum: 1 },
  },
  required: ["representedDuration", "observationCount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { durationPerObservation: { type: "number" } },
  required: ["durationPerObservation"],
} as const;
/** Divide explicit represented work-sampling duration equally among a positive supplied observation count without asserting representative sampling. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { representedDuration, observationCount } = request;
  const compute = (): Output => {
    H.domain(representedDuration >= 0, "representedDuration");
    (H.domain(
      Number.isSafeInteger(observationCount) &&
        observationCount >= 1 &&
        observationCount <= Number.MAX_SAFE_INTEGER,
      "observationCount",
    ),
      observationCount);
    return { durationPerObservation: representedDuration / observationCount };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { representedDuration: 120, observationCount: 30 },
  output: { durationPerObservation: 4 },
} satisfies ToolExample<Input, Output>;
export const workSamplingObservationWeightTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "industrial-engineering/work-sampling-observation-weight",
    title: "Work Sampling Observation Weight Tool",
    description:
      "Divide explicit represented work-sampling duration equally among a positive supplied observation count without asserting representative sampling.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        representedDuration: { type: "number", minimum: 0 },
        observationCount: { type: "integer", minimum: 1 },
      },
      required: ["representedDuration", "observationCount"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { durationPerObservation: { type: "number" } },
      required: ["durationPerObservation"],
    },
    ports: {
      inputs: [
        {
          id: "representedDuration",
          label: "Represented Duration",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "observationCount",
          label: "Observation Count",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "durationPerObservation",
          label: "Duration Per Observation",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = workSamplingObservationWeightTool.execute;
export default workSamplingObservationWeightTool;
