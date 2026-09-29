import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly importValue: number;
  readonly excludedValue: number;
  readonly specificDuty: number;
  readonly suppliedRate: number;
  readonly suppliedDuty: number;
};
export type Output = {
  readonly adValoremBase: number;
  readonly modeledDuty: number;
  readonly margin: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    importValue: { type: "number", minimum: 0 },
    excludedValue: { type: "number", minimum: 0 },
    specificDuty: { type: "number", minimum: 0 },
    suppliedRate: { type: "number", minimum: 0 },
    suppliedDuty: { type: "number", minimum: 0 },
  },
  required: [
    "importValue",
    "excludedValue",
    "specificDuty",
    "suppliedRate",
    "suppliedDuty",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    adValoremBase: { type: "number" },
    modeledDuty: { type: "number" },
    margin: { type: "number" },
  },
  required: ["adValoremBase", "modeledDuty", "margin"],
} as const;
/** Calculate import tariff basis margin from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    importValue,
    excludedValue,
    specificDuty,
    suppliedRate,
    suppliedDuty,
  } = request;
  const compute = (): Output => {
    H.domain(
      importValue >= 0 &&
        excludedValue >= 0 &&
        excludedValue <= importValue &&
        specificDuty >= 0 &&
        suppliedRate >= 0 &&
        suppliedDuty >= 0,
    );
    return (() => {
      const adValoremBase = importValue - excludedValue,
        modeledDuty = adValoremBase * suppliedRate + specificDuty;
      return { adValoremBase, modeledDuty, margin: suppliedDuty - modeledDuty };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    importValue: 100,
    excludedValue: 20,
    specificDuty: 5,
    suppliedRate: 0.1,
    suppliedDuty: 15,
  },
  output: { adValoremBase: 80, modeledDuty: 13, margin: 2 },
} satisfies ToolExample<Input, Output>;
export const importTariffBasisMarginTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "international-economics/import-tariff-basis-margin",
    title: "Import Tariff Basis Margin Tool",
    description:
      "Calculate import tariff basis margin from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        importValue: { type: "number", minimum: 0 },
        excludedValue: { type: "number", minimum: 0 },
        specificDuty: { type: "number", minimum: 0 },
        suppliedRate: { type: "number", minimum: 0 },
        suppliedDuty: { type: "number", minimum: 0 },
      },
      required: [
        "importValue",
        "excludedValue",
        "specificDuty",
        "suppliedRate",
        "suppliedDuty",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        adValoremBase: { type: "number" },
        modeledDuty: { type: "number" },
        margin: { type: "number" },
      },
      required: ["adValoremBase", "modeledDuty", "margin"],
    },
    ports: {
      inputs: [
        {
          id: "importValue",
          label: "Import Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "excludedValue",
          label: "Excluded Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "specificDuty",
          label: "Specific Duty",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedRate",
          label: "Supplied Rate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedDuty",
          label: "Supplied Duty",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "adValoremBase",
          label: "Ad Valorem Base",
          valueType: { type: "number" },
        },
        {
          id: "modeledDuty",
          label: "Modeled Duty",
          valueType: { type: "number" },
        },
        { id: "margin", label: "Margin", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = importTariffBasisMarginTool.execute;
export default importTariffBasisMarginTool;
