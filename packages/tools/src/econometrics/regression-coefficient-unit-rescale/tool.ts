import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly originalCoefficient: number;
  readonly oldPredictorUnitsPerNewUnit: number;
  readonly oldOutcomeUnitsPerNewUnit: number;
};
export type Output = { readonly rescaledCoefficient: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    originalCoefficient: { type: "number" },
    oldPredictorUnitsPerNewUnit: { type: "number", exclusiveMinimum: 0 },
    oldOutcomeUnitsPerNewUnit: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "originalCoefficient",
    "oldPredictorUnitsPerNewUnit",
    "oldOutcomeUnitsPerNewUnit",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { rescaledCoefficient: { type: "number" } },
  required: ["rescaledCoefficient"],
} as const;
/** Rescale a slope coefficient when predictor and outcome units change by explicit positive factors, excluding origin changes and model refitting. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    originalCoefficient,
    oldPredictorUnitsPerNewUnit,
    oldOutcomeUnitsPerNewUnit,
  } = request;
  const compute = (): Output => {
    (H.domain(oldPredictorUnitsPerNewUnit > 0, "oldPredictorUnitsPerNewUnit"),
      oldPredictorUnitsPerNewUnit);
    (H.domain(oldOutcomeUnitsPerNewUnit > 0, "oldOutcomeUnitsPerNewUnit"),
      oldOutcomeUnitsPerNewUnit);
    return {
      rescaledCoefficient:
        (originalCoefficient * oldPredictorUnitsPerNewUnit) /
        oldOutcomeUnitsPerNewUnit,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    originalCoefficient: 2,
    oldPredictorUnitsPerNewUnit: 1000,
    oldOutcomeUnitsPerNewUnit: 1,
  },
  output: { rescaledCoefficient: 2000 },
} satisfies ToolExample<Input, Output>;
export const regressionCoefficientUnitRescaleTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["econometrics", "economics"],
      keywords: ["econometrics", "economics"],
    },
    id: "econometrics/regression-coefficient-unit-rescale",
    title: "Regression Coefficient Unit Rescale",
    description:
      "Rescale a slope coefficient when predictor and outcome units change by explicit positive factors, excluding origin changes and model refitting.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        originalCoefficient: { type: "number" },
        oldPredictorUnitsPerNewUnit: { type: "number", exclusiveMinimum: 0 },
        oldOutcomeUnitsPerNewUnit: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "originalCoefficient",
        "oldPredictorUnitsPerNewUnit",
        "oldOutcomeUnitsPerNewUnit",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { rescaledCoefficient: { type: "number" } },
      required: ["rescaledCoefficient"],
    },
    ports: {
      inputs: [
        {
          id: "originalCoefficient",
          label: "Original Coefficient",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "oldPredictorUnitsPerNewUnit",
          label: "Old Predictor Units Per New Unit",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "oldOutcomeUnitsPerNewUnit",
          label: "Old Outcome Units Per New Unit",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "rescaledCoefficient",
          label: "Rescaled Coefficient",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = regressionCoefficientUnitRescaleTool.execute;
export default regressionCoefficientUnitRescaleTool;
