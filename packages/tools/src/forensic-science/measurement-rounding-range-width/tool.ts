import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly quantum: number;
  readonly lowerInclusive: boolean;
  readonly upperInclusive: boolean;
};
export type Output = {
  readonly width: number;
  readonly lowerIncluded: boolean;
  readonly upperIncluded: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    quantum: { type: "number", exclusiveMinimum: 0 },
    lowerInclusive: { type: "boolean" },
    upperInclusive: { type: "boolean" },
  },
  required: ["quantum", "lowerInclusive", "upperInclusive"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    width: { type: "number" },
    lowerIncluded: { type: "boolean" },
    upperIncluded: { type: "boolean" },
  },
  required: ["width", "lowerIncluded", "upperIncluded"],
} as const;
/** Report one nearest-rounding cell width with explicit endpoint membership; no measurement uncertainty is inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { quantum, lowerInclusive, upperInclusive } = request;
  const compute = (): Output => {
    H.positive(quantum);
    return {
      width: quantum,
      lowerIncluded: lowerInclusive,
      upperIncluded: upperInclusive,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { quantum: 0.1, lowerInclusive: true, upperInclusive: false },
  output: { width: 0.1, lowerIncluded: true, upperIncluded: false },
} satisfies ToolExample<Input, Output>;
export const measurementRoundingRangeWidthTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "forensic-science/measurement-rounding-range-width",
    title: "Measurement Rounding Range Width Tool",
    description:
      "Report one nearest-rounding cell width with explicit endpoint membership; no measurement uncertainty is inferred.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        quantum: { type: "number", exclusiveMinimum: 0 },
        lowerInclusive: { type: "boolean" },
        upperInclusive: { type: "boolean" },
      },
      required: ["quantum", "lowerInclusive", "upperInclusive"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        width: { type: "number" },
        lowerIncluded: { type: "boolean" },
        upperIncluded: { type: "boolean" },
      },
      required: ["width", "lowerIncluded", "upperIncluded"],
    },
    ports: {
      inputs: [
        {
          id: "quantum",
          label: "Quantum",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "lowerInclusive",
          label: "Lower Inclusive",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "upperInclusive",
          label: "Upper Inclusive",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "width", label: "Width", valueType: { type: "number" } },
        {
          id: "lowerIncluded",
          label: "Lower Included",
          valueType: { type: "boolean" },
        },
        {
          id: "upperIncluded",
          label: "Upper Included",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = measurementRoundingRangeWidthTool.execute;
export default measurementRoundingRangeWidthTool;
