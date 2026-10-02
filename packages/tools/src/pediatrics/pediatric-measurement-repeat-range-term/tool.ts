import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly measurements: readonly number[];
  readonly resolution: number;
};
export type Output = {
  readonly mean: number;
  readonly range: number;
  readonly rangeInResolutionUnits: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    measurements: { type: "array", maxItems: 256, items: { type: "number" } },
    resolution: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["measurements", "resolution"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    mean: { type: "number" },
    range: { type: "number" },
    rangeInResolutionUnits: { type: "number" },
  },
  required: ["mean", "range", "rangeInResolutionUnits"],
} as const;
/** Descriptive research repeatability relative to a supplied instrument resolution, without a pediatric reference range. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { measurements, resolution } = request;
  const compute = (): Output => {
    H.domain(measurements.length > 0);
    H.positive(resolution);
    return {
      mean: measurements.reduce((a, b) => a + b, 0) / measurements.length,
      range: Math.max(...measurements) - Math.min(...measurements),
      rangeInResolutionUnits:
        (Math.max(...measurements) - Math.min(...measurements)) / resolution,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { measurements: [10, 11, 12], resolution: 0.5 },
  output: { mean: 11, range: 2, rangeInResolutionUnits: 4 },
} satisfies ToolExample<Input, Output>;
export const pediatricMeasurementRepeatRangeTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "pediatrics/pediatric-measurement-repeat-range-term",
      title: "Pediatric Measurement Repeat Range Term Tool",
      description:
        "Descriptive research repeatability relative to a supplied instrument resolution, without a pediatric reference range.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          measurements: {
            type: "array",
            maxItems: 256,
            items: { type: "number" },
          },
          resolution: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["measurements", "resolution"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          mean: { type: "number" },
          range: { type: "number" },
          rangeInResolutionUnits: { type: "number" },
        },
        required: ["mean", "range", "rangeInResolutionUnits"],
      },
      ports: {
        inputs: [
          {
            id: "measurements",
            label: "Measurements",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
          },
          {
            id: "resolution",
            label: "Resolution",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "mean", label: "Mean", valueType: { type: "number" } },
          { id: "range", label: "Range", valueType: { type: "number" } },
          {
            id: "rangeInResolutionUnits",
            label: "Range In Resolution Units",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = pediatricMeasurementRepeatRangeTermTool.execute;
export default pediatricMeasurementRepeatRangeTermTool;
