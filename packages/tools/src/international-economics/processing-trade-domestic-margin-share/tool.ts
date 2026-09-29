import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly exportValue: number;
  readonly importedInputs: number;
  readonly domesticInputs: number;
};
export type Output = {
  readonly domesticValueAdded: number;
  readonly domesticContentFraction: number;
  readonly netProcessingMargin: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    exportValue: { type: "number", exclusiveMinimum: 0 },
    importedInputs: { type: "number", minimum: 0 },
    domesticInputs: { type: "number", minimum: 0 },
  },
  required: ["exportValue", "importedInputs", "domesticInputs"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    domesticValueAdded: { type: "number" },
    domesticContentFraction: { type: "number" },
    netProcessingMargin: { type: "number" },
  },
  required: [
    "domesticValueAdded",
    "domesticContentFraction",
    "netProcessingMargin",
  ],
} as const;
/** Direct imported-input content accounting only; domestic inputs may themselves contain imported content not resolved here. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { exportValue, importedInputs, domesticInputs } = request;
  const compute = (): Output => {
    H.positive(exportValue);
    H.domain(importedInputs >= 0 && domesticInputs >= 0);
    return {
      domesticValueAdded: exportValue - importedInputs,
      domesticContentFraction: (exportValue - importedInputs) / exportValue,
      netProcessingMargin: exportValue - importedInputs - domesticInputs,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { exportValue: 1000, importedInputs: 600, domesticInputs: 200 },
  output: {
    domesticValueAdded: 400,
    domesticContentFraction: 0.4,
    netProcessingMargin: 200,
  },
} satisfies ToolExample<Input, Output>;
export const processingTradeDomesticMarginShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "international-economics/processing-trade-domestic-margin-share",
    title: "Processing Trade Domestic Margin Share Tool",
    description:
      "Direct imported-input content accounting only; domestic inputs may themselves contain imported content not resolved here.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        exportValue: { type: "number", exclusiveMinimum: 0 },
        importedInputs: { type: "number", minimum: 0 },
        domesticInputs: { type: "number", minimum: 0 },
      },
      required: ["exportValue", "importedInputs", "domesticInputs"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        domesticValueAdded: { type: "number" },
        domesticContentFraction: { type: "number" },
        netProcessingMargin: { type: "number" },
      },
      required: [
        "domesticValueAdded",
        "domesticContentFraction",
        "netProcessingMargin",
      ],
    },
    ports: {
      inputs: [
        {
          id: "exportValue",
          label: "Export Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "importedInputs",
          label: "Imported Inputs",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "domesticInputs",
          label: "Domestic Inputs",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "domesticValueAdded",
          label: "Domestic Value Added",
          valueType: { type: "number" },
        },
        {
          id: "domesticContentFraction",
          label: "Domestic Content Fraction",
          valueType: { type: "number" },
        },
        {
          id: "netProcessingMargin",
          label: "Net Processing Margin",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = processingTradeDomesticMarginShareTool.execute;
export default processingTradeDomesticMarginShareTool;
