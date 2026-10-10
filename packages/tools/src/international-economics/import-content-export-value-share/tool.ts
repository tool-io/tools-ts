import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly importedContentValue: number;
  readonly totalExportValue: number;
};
export type Output = {
  readonly importedContentShare: number;
  readonly otherValue: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    importedContentValue: { type: "number", minimum: 0 },
    totalExportValue: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["importedContentValue", "totalExportValue"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    importedContentShare: { type: "number" },
    otherValue: { type: "number" },
  },
  required: ["importedContentShare", "otherValue"],
} as const;
/** Normalize an explicitly attributed imported-content value to compatible export value without estimating a supply-chain decomposition. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { importedContentValue, totalExportValue } = request;
  const compute = (): Output => {
    (H.domain(totalExportValue > 0, "totalExportValue"), totalExportValue);
    H.domain(
      importedContentValue >= 0 && importedContentValue <= totalExportValue,
      "importedContentValue",
    );
    return {
      importedContentShare: importedContentValue / totalExportValue,
      otherValue: totalExportValue - importedContentValue,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { importedContentValue: 30, totalExportValue: 100 },
  output: { importedContentShare: 0.3, otherValue: 70 },
} satisfies ToolExample<Input, Output>;
export const importContentExportValueShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "international-economics",
        "international economics",
        "economics",
      ],
      keywords: ["international economics", "economics"],
    },
    id: "international-economics/import-content-export-value-share",
    title: "Import Content Export Value Share",
    description:
      "Normalize an explicitly attributed imported-content value to compatible export value without estimating a supply-chain decomposition.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        importedContentValue: { type: "number", minimum: 0 },
        totalExportValue: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["importedContentValue", "totalExportValue"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        importedContentShare: { type: "number" },
        otherValue: { type: "number" },
      },
      required: ["importedContentShare", "otherValue"],
    },
    ports: {
      inputs: [
        {
          id: "importedContentValue",
          label: "Imported Content Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "totalExportValue",
          label: "Total Export Value",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "importedContentShare",
          label: "Imported Content Share",
          valueType: { type: "number" },
        },
        {
          id: "otherValue",
          label: "Other Value",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = importContentExportValueShareTool.execute;
export default importContentExportValueShareTool;
