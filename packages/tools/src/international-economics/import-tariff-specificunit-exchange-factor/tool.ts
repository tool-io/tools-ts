import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly specificForeignDuty: number;
  readonly domesticPerForeign: number;
  readonly unitsPerCustomsUnit: number;
  readonly shipmentUnits: number;
};
export type Output = {
  readonly domesticDutyPerUnit: number;
  readonly totalDuty: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    specificForeignDuty: { type: "number", minimum: 0 },
    domesticPerForeign: { type: "number", exclusiveMinimum: 0 },
    unitsPerCustomsUnit: { type: "number", exclusiveMinimum: 0 },
    shipmentUnits: { type: "number", minimum: 0 },
  },
  required: [
    "specificForeignDuty",
    "domesticPerForeign",
    "unitsPerCustomsUnit",
    "shipmentUnits",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    domesticDutyPerUnit: { type: "number" },
    totalDuty: { type: "number" },
  },
  required: ["domesticDutyPerUnit", "totalDuty"],
} as const;
/** Calculate import tariff specificunit exchange factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    specificForeignDuty,
    domesticPerForeign,
    unitsPerCustomsUnit,
    shipmentUnits,
  } = request;
  const compute = (): Output => {
    H.domain(specificForeignDuty >= 0 && shipmentUnits >= 0);
    H.positive(domesticPerForeign);
    H.positive(unitsPerCustomsUnit);
    return {
      domesticDutyPerUnit:
        (specificForeignDuty * domesticPerForeign) / unitsPerCustomsUnit,
      totalDuty:
        (specificForeignDuty * domesticPerForeign * shipmentUnits) /
        unitsPerCustomsUnit,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    specificForeignDuty: 10,
    domesticPerForeign: 2,
    unitsPerCustomsUnit: 100,
    shipmentUnits: 500,
  },
  output: { domesticDutyPerUnit: 0.2, totalDuty: 100 },
} satisfies ToolExample<Input, Output>;
export const importTariffSpecificunitExchangeFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "international-economics/import-tariff-specificunit-exchange-factor",
      title: "Import Tariff Specificunit Exchange Factor Tool",
      description:
        "Calculate import tariff specificunit exchange factor from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          specificForeignDuty: { type: "number", minimum: 0 },
          domesticPerForeign: { type: "number", exclusiveMinimum: 0 },
          unitsPerCustomsUnit: { type: "number", exclusiveMinimum: 0 },
          shipmentUnits: { type: "number", minimum: 0 },
        },
        required: [
          "specificForeignDuty",
          "domesticPerForeign",
          "unitsPerCustomsUnit",
          "shipmentUnits",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          domesticDutyPerUnit: { type: "number" },
          totalDuty: { type: "number" },
        },
        required: ["domesticDutyPerUnit", "totalDuty"],
      },
      ports: {
        inputs: [
          {
            id: "specificForeignDuty",
            label: "Specific Foreign Duty",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "domesticPerForeign",
            label: "Domestic Per Foreign",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "unitsPerCustomsUnit",
            label: "Units Per Customs Unit",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "shipmentUnits",
            label: "Shipment Units",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "domesticDutyPerUnit",
            label: "Domestic Duty Per Unit",
            valueType: { type: "number" },
          },
          {
            id: "totalDuty",
            label: "Total Duty",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = importTariffSpecificunitExchangeFactorTool.execute;
export default importTariffSpecificunitExchangeFactorTool;
