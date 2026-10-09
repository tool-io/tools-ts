import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly fieldPixelArea: number;
  readonly referencePixelLength: number;
  readonly referencePhysicalLength: number;
};
export type Output = { readonly physicalFieldArea: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fieldPixelArea: { type: "number", minimum: 0 },
    referencePixelLength: { type: "number", exclusiveMinimum: 0 },
    referencePhysicalLength: { type: "number", minimum: 0 },
  },
  required: [
    "fieldPixelArea",
    "referencePixelLength",
    "referencePhysicalLength",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { physicalFieldArea: { type: "number" } },
  required: ["physicalFieldArea"],
} as const;
/** Scale an explicit blood-film pixel area by the square of a supplied linear calibration without identifying cells. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { fieldPixelArea, referencePixelLength, referencePhysicalLength } =
    request;
  const compute = (): Output => {
    H.domain(fieldPixelArea >= 0, "fieldPixelArea");
    (H.domain(
      Number.isFinite(referencePixelLength) && referencePixelLength > 0,
      "referencePixelLength",
    ),
      referencePixelLength);
    H.domain(referencePhysicalLength >= 0, "referencePhysicalLength");
    return {
      physicalFieldArea:
        fieldPixelArea * (referencePhysicalLength / referencePixelLength) ** 2,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    fieldPixelArea: 10000,
    referencePixelLength: 100,
    referencePhysicalLength: 0.2,
  },
  output: { physicalFieldArea: 0.04 },
} satisfies ToolExample<Input, Output>;
export const bloodFilmFieldAreaCalibrationTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hematology/blood-film-field-area-calibration",
    title: "Blood Film Field Area Calibration Tool",
    description:
      "Scale an explicit blood-film pixel area by the square of a supplied linear calibration without identifying cells.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fieldPixelArea: { type: "number", minimum: 0 },
        referencePixelLength: { type: "number", exclusiveMinimum: 0 },
        referencePhysicalLength: { type: "number", minimum: 0 },
      },
      required: [
        "fieldPixelArea",
        "referencePixelLength",
        "referencePhysicalLength",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { physicalFieldArea: { type: "number" } },
      required: ["physicalFieldArea"],
    },
    ports: {
      inputs: [
        {
          id: "fieldPixelArea",
          label: "Field Pixel Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referencePixelLength",
          label: "Reference Pixel Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referencePhysicalLength",
          label: "Reference Physical Length",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "physicalFieldArea",
          label: "Physical Field Area",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = bloodFilmFieldAreaCalibrationTool.execute;
export default bloodFilmFieldAreaCalibrationTool;
