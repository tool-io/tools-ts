import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly specificDutyPerUnit: number;
  readonly customsValuePerUnit: number;
  readonly quantity: number;
};
export type Output = { readonly equivalentRate: number; readonly duty: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    specificDutyPerUnit: { type: "number" },
    customsValuePerUnit: { type: "number", exclusiveMinimum: 0 },
    quantity: { type: "number", minimum: 0 },
  },
  required: ["specificDutyPerUnit", "customsValuePerUnit", "quantity"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { equivalentRate: { type: "number" }, duty: { type: "number" } },
  required: ["equivalentRate", "duty"],
} as const;
/** Calculate historical tariff specific ad valorem crosswalk from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { specificDutyPerUnit, customsValuePerUnit, quantity } = request;
  const compute = (): Output => {
    H.positive(customsValuePerUnit);
    H.domain(quantity >= 0);
    return {
      equivalentRate: specificDutyPerUnit / customsValuePerUnit,
      duty: specificDutyPerUnit * quantity,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { specificDutyPerUnit: 3, customsValuePerUnit: 20, quantity: 10 },
  output: { equivalentRate: 0.15, duty: 30 },
} satisfies ToolExample<Input, Output>;
export const historicalTariffSpecificAdValoremCrosswalkTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "economic-history/historical-tariff-specific-ad-valorem-crosswalk",
      title: "Historical Tariff Specific Ad Valorem Crosswalk Tool",
      description:
        "Calculate historical tariff specific ad valorem crosswalk from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          specificDutyPerUnit: { type: "number" },
          customsValuePerUnit: { type: "number", exclusiveMinimum: 0 },
          quantity: { type: "number", minimum: 0 },
        },
        required: ["specificDutyPerUnit", "customsValuePerUnit", "quantity"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          equivalentRate: { type: "number" },
          duty: { type: "number" },
        },
        required: ["equivalentRate", "duty"],
      },
      ports: {
        inputs: [
          {
            id: "specificDutyPerUnit",
            label: "Specific Duty Per Unit",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "customsValuePerUnit",
            label: "Customs Value Per Unit",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "quantity",
            label: "Quantity",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "equivalentRate",
            label: "Equivalent Rate",
            valueType: { type: "number" },
          },
          { id: "duty", label: "Duty", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = historicalTariffSpecificAdValoremCrosswalkTool.execute;
export default historicalTariffSpecificAdValoremCrosswalkTool;
