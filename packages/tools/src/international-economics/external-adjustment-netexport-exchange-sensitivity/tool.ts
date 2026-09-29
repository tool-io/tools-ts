import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly exportValue: number;
  readonly importValue: number;
  readonly exportElasticity: number;
  readonly importElasticity: number;
  readonly exchangeChange: number;
};
export type Output = {
  readonly exportChange: number;
  readonly importChange: number;
  readonly netExportChange: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    exportValue: { type: "number", minimum: 0 },
    importValue: { type: "number", minimum: 0 },
    exportElasticity: { type: "number" },
    importElasticity: { type: "number" },
    exchangeChange: { type: "number" },
  },
  required: [
    "exportValue",
    "importValue",
    "exportElasticity",
    "importElasticity",
    "exchangeChange",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    exportChange: { type: "number" },
    importChange: { type: "number" },
    netExportChange: { type: "number" },
  },
  required: ["exportChange", "importChange", "netExportChange"],
} as const;
/** First-order trade-value sensitivity using explicitly signed value elasticities; no Marshall-Lerner condition or quantity-price decomposition is inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    exportValue,
    importValue,
    exportElasticity,
    importElasticity,
    exchangeChange,
  } = request;
  const compute = (): Output => {
    H.domain(exportValue >= 0 && importValue >= 0);
    return {
      exportChange: exportValue * exportElasticity * exchangeChange,
      importChange: importValue * importElasticity * exchangeChange,
      netExportChange:
        (exportValue * exportElasticity - importValue * importElasticity) *
        exchangeChange,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    exportValue: 100,
    importValue: 80,
    exportElasticity: 0.5,
    importElasticity: -0.2,
    exchangeChange: 0.1,
  },
  output: {
    exportChange: 5,
    importChange: -1.6,
    netExportChange: 6.6000000000000005,
  },
} satisfies ToolExample<Input, Output>;
export const externalAdjustmentNetexportExchangeSensitivityTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "international-economics/external-adjustment-netexport-exchange-sensitivity",
      title: "External Adjustment Netexport Exchange Sensitivity Tool",
      description:
        "First-order trade-value sensitivity using explicitly signed value elasticities; no Marshall-Lerner condition or quantity-price decomposition is inferred.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          exportValue: { type: "number", minimum: 0 },
          importValue: { type: "number", minimum: 0 },
          exportElasticity: { type: "number" },
          importElasticity: { type: "number" },
          exchangeChange: { type: "number" },
        },
        required: [
          "exportValue",
          "importValue",
          "exportElasticity",
          "importElasticity",
          "exchangeChange",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          exportChange: { type: "number" },
          importChange: { type: "number" },
          netExportChange: { type: "number" },
        },
        required: ["exportChange", "importChange", "netExportChange"],
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
            id: "importValue",
            label: "Import Value",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "exportElasticity",
            label: "Export Elasticity",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "importElasticity",
            label: "Import Elasticity",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "exchangeChange",
            label: "Exchange Change",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "exportChange",
            label: "Export Change",
            valueType: { type: "number" },
          },
          {
            id: "importChange",
            label: "Import Change",
            valueType: { type: "number" },
          },
          {
            id: "netExportChange",
            label: "Net Export Change",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = externalAdjustmentNetexportExchangeSensitivityTool.execute;
export default externalAdjustmentNetexportExchangeSensitivityTool;
