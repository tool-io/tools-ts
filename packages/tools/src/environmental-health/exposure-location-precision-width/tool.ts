import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly lowerCoordinate: number;
  readonly upperCoordinate: number;
};
export type Output = { readonly width: number; readonly midpoint: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lowerCoordinate: { type: "number" },
    upperCoordinate: { type: "number" },
  },
  required: ["lowerCoordinate", "upperCoordinate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { width: { type: "number" }, midpoint: { type: "number" } },
  required: ["width", "midpoint"],
} as const;
/** Measure a supplied location-coordinate interval without inferring a residence or individual exposure. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { lowerCoordinate, upperCoordinate } = request;
  const compute = (): Output => {
    H.domain(upperCoordinate >= lowerCoordinate);
    return {
      width: upperCoordinate - lowerCoordinate,
      midpoint: lowerCoordinate / 2 + upperCoordinate / 2,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { lowerCoordinate: 10, upperCoordinate: 14 },
  output: { width: 4, midpoint: 12 },
} satisfies ToolExample<Input, Output>;
export const exposureLocationPrecisionWidthTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "environmental-health/exposure-location-precision-width",
    title: "Exposure Location Precision Width Tool",
    description:
      "Measure a supplied location-coordinate interval without inferring a residence or individual exposure.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lowerCoordinate: { type: "number" },
        upperCoordinate: { type: "number" },
      },
      required: ["lowerCoordinate", "upperCoordinate"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { width: { type: "number" }, midpoint: { type: "number" } },
      required: ["width", "midpoint"],
    },
    ports: {
      inputs: [
        {
          id: "lowerCoordinate",
          label: "Lower Coordinate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "upperCoordinate",
          label: "Upper Coordinate",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "width", label: "Width", valueType: { type: "number" } },
        { id: "midpoint", label: "Midpoint", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = exposureLocationPrecisionWidthTool.execute;
export default exposureLocationPrecisionWidthTool;
