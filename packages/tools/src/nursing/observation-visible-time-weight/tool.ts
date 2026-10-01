import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly visibleTime: number;
  readonly eligibleTime: number;
  readonly observationValue: number;
};
export type Output = { readonly weight: number; readonly contribution: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    visibleTime: { type: "number", minimum: 0 },
    eligibleTime: { type: "number", exclusiveMinimum: 0 },
    observationValue: { type: "number" },
  },
  required: ["visibleTime", "eligibleTime", "observationValue"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { weight: { type: "number" }, contribution: { type: "number" } },
  required: ["weight", "contribution"],
} as const;
/** Return one caller-classified research visibility contribution, not a patient-observation score. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { visibleTime, eligibleTime, observationValue } = request;
  const compute = (): Output => {
    H.positive(eligibleTime);
    H.domain(visibleTime >= 0 && visibleTime <= eligibleTime);
    return {
      weight: visibleTime / eligibleTime,
      contribution: (observationValue * visibleTime) / eligibleTime,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { visibleTime: 3, eligibleTime: 12, observationValue: 8 },
  output: { weight: 0.25, contribution: 2 },
} satisfies ToolExample<Input, Output>;
export const observationVisibleTimeWeightTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "nursing/observation-visible-time-weight",
    title: "Observation Visible Time Weight Tool",
    description:
      "Return one caller-classified research visibility contribution, not a patient-observation score.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        visibleTime: { type: "number", minimum: 0 },
        eligibleTime: { type: "number", exclusiveMinimum: 0 },
        observationValue: { type: "number" },
      },
      required: ["visibleTime", "eligibleTime", "observationValue"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        weight: { type: "number" },
        contribution: { type: "number" },
      },
      required: ["weight", "contribution"],
    },
    ports: {
      inputs: [
        {
          id: "visibleTime",
          label: "Visible Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "eligibleTime",
          label: "Eligible Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "observationValue",
          label: "Observation Value",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "weight", label: "Weight", valueType: { type: "number" } },
        {
          id: "contribution",
          label: "Contribution",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = observationVisibleTimeWeightTool.execute;
export default observationVisibleTimeWeightTool;
