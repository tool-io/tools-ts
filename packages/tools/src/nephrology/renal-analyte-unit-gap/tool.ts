import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly reportedValue: number;
  readonly suppliedUnitFactor: number;
  readonly referenceValue: number;
  readonly dilutionFactor: number;
};
export type Output = {
  readonly convertedValue: number;
  readonly residual: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reportedValue: { type: "number" },
    suppliedUnitFactor: { type: "number", exclusiveMinimum: 0 },
    referenceValue: { type: "number" },
    dilutionFactor: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "reportedValue",
    "suppliedUnitFactor",
    "referenceValue",
    "dilutionFactor",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    convertedValue: { type: "number" },
    residual: { type: "number" },
  },
  required: ["convertedValue", "residual"],
} as const;
/** Compare explicit bench analyte units and dilution metadata without renal-function estimation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { reportedValue, suppliedUnitFactor, referenceValue, dilutionFactor } =
    request;
  const compute = (): Output => {
    H.positive(suppliedUnitFactor);
    H.positive(dilutionFactor);
    return (() => {
      const convertedValue =
        reportedValue * suppliedUnitFactor * dilutionFactor;
      return { convertedValue, residual: convertedValue - referenceValue };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    reportedValue: 2,
    suppliedUnitFactor: 3,
    referenceValue: 10,
    dilutionFactor: 2,
  },
  output: { convertedValue: 12, residual: 2 },
} satisfies ToolExample<Input, Output>;
export const renalAnalyteUnitGapTool = H.defineSchemaCalculation<Input, Output>(
  {
    ...{
      id: "nephrology/renal-analyte-unit-gap",
      title: "Renal Analyte Unit Gap Tool",
      description:
        "Compare explicit bench analyte units and dilution metadata without renal-function estimation.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          reportedValue: { type: "number" },
          suppliedUnitFactor: { type: "number", exclusiveMinimum: 0 },
          referenceValue: { type: "number" },
          dilutionFactor: { type: "number", exclusiveMinimum: 0 },
        },
        required: [
          "reportedValue",
          "suppliedUnitFactor",
          "referenceValue",
          "dilutionFactor",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          convertedValue: { type: "number" },
          residual: { type: "number" },
        },
        required: ["convertedValue", "residual"],
      },
      ports: {
        inputs: [
          {
            id: "reportedValue",
            label: "Reported Value",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "suppliedUnitFactor",
            label: "Supplied Unit Factor",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "referenceValue",
            label: "Reference Value",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "dilutionFactor",
            label: "Dilution Factor",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "convertedValue",
            label: "Converted Value",
            valueType: { type: "number" },
          },
          { id: "residual", label: "Residual", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  },
);
export const run = renalAnalyteUnitGapTool.execute;
export default renalAnalyteUnitGapTool;
