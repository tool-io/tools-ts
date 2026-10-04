import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly detectionLimit: number; readonly unit: string };
export type Output = {
  readonly lowerBound: number;
  readonly upperBound: number;
  readonly upperInclusive: boolean;
  readonly label: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    detectionLimit: { type: "number", exclusiveMinimum: 0 },
    unit: { type: "string", maxLength: 8192 },
  },
  required: ["detectionLimit", "unit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lowerBound: { type: "number" },
    upperBound: { type: "number" },
    upperInclusive: { type: "boolean" },
    label: { type: "string", maxLength: 8192 },
  },
  required: ["lowerBound", "upperBound", "upperInclusive", "label"],
} as const;
/** Represent a nonnegative nondetect concentration as a left-censored interval below an explicit detection limit; no numerical substitution is performed. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { detectionLimit, unit } = request;
  const compute = (): Output => {
    (H.domain(detectionLimit > 0, "detectionLimit"), detectionLimit);
    H.domain(unit.length > 0, "unit");
    return {
      lowerBound: 0,
      upperBound: detectionLimit,
      upperInclusive: false,
      label: "[0, " + detectionLimit + ") " + unit,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { detectionLimit: 0.2, unit: "mg/L" },
  output: {
    lowerBound: 0,
    upperBound: 0.2,
    upperInclusive: false,
    label: "[0, 0.2) mg/L",
  },
} satisfies ToolExample<Input, Output>;
export const nondetectObservationIntervalLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "environmental-science/nondetect-observation-interval-label",
    title: "Nondetect Observation Interval Label Tool",
    description:
      "Represent a nonnegative nondetect concentration as a left-censored interval below an explicit detection limit; no numerical substitution is performed.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        detectionLimit: { type: "number", exclusiveMinimum: 0 },
        unit: { type: "string", maxLength: 8192 },
      },
      required: ["detectionLimit", "unit"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lowerBound: { type: "number" },
        upperBound: { type: "number" },
        upperInclusive: { type: "boolean" },
        label: { type: "string", maxLength: 8192 },
      },
      required: ["lowerBound", "upperBound", "upperInclusive", "label"],
    },
    ports: {
      inputs: [
        {
          id: "detectionLimit",
          label: "Detection Limit",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "unit",
          label: "Unit",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "lowerBound",
          label: "Lower Bound",
          valueType: { type: "number" },
        },
        {
          id: "upperBound",
          label: "Upper Bound",
          valueType: { type: "number" },
        },
        {
          id: "upperInclusive",
          label: "Upper Inclusive",
          valueType: { type: "boolean" },
        },
        { id: "label", label: "Label", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = nondetectObservationIntervalLabelTool.execute;
export default nondetectObservationIntervalLabelTool;
