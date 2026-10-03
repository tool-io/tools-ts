import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly dose: number;
  readonly area: number;
  readonly doseToGray: number;
  readonly areaToSquareMeters: number;
};
export type Output = { readonly graySquareMeters: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dose: { type: "number", minimum: 0 },
    area: { type: "number", minimum: 0 },
    doseToGray: { type: "number", exclusiveMinimum: 0 },
    areaToSquareMeters: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["dose", "area", "doseToGray", "areaToSquareMeters"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { graySquareMeters: { type: "number" } },
  required: ["graySquareMeters"],
} as const;
/** Bench dose-area product unit arithmetic using explicit gray and square-meter factors, without patient dose inference or exposure recommendations. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { dose, area, doseToGray, areaToSquareMeters } = request;
  const compute = (): Output => {
    H.domain(dose >= 0 && area >= 0);
    H.positive(doseToGray);
    H.positive(areaToSquareMeters);
    return { graySquareMeters: dose * area * doseToGray * areaToSquareMeters };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { dose: 2, area: 100, doseToGray: 0.001, areaToSquareMeters: 0.0001 },
  output: { graySquareMeters: 0.00002 },
} satisfies ToolExample<Input, Output>;
export const radiologyBenchDoseAreaUnitFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "radiology/radiology-bench-dose-area-unit-factor",
    title: "Radiology Bench Dose Area Unit Factor Tool",
    description:
      "Bench dose-area product unit arithmetic using explicit gray and square-meter factors, without patient dose inference or exposure recommendations.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        dose: { type: "number", minimum: 0 },
        area: { type: "number", minimum: 0 },
        doseToGray: { type: "number", exclusiveMinimum: 0 },
        areaToSquareMeters: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["dose", "area", "doseToGray", "areaToSquareMeters"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { graySquareMeters: { type: "number" } },
      required: ["graySquareMeters"],
    },
    ports: {
      inputs: [
        {
          id: "dose",
          label: "Dose",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "area",
          label: "Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "doseToGray",
          label: "Dose To Gray",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "areaToSquareMeters",
          label: "Area To Square Meters",
          required: true,
          valueType: { type: "number", unit: "m" },
        },
      ],
      outputs: [
        {
          id: "graySquareMeters",
          label: "Gray Square Meters",
          valueType: { type: "number", unit: "m" },
        },
      ],
    },
  },
  calculate,
});
export const run = radiologyBenchDoseAreaUnitFactorTool.execute;
export default radiologyBenchDoseAreaUnitFactorTool;
