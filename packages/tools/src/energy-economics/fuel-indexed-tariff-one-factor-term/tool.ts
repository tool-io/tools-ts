import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly baseTariff: number;
  readonly fuelShare: number;
  readonly currentIndex: number;
  readonly baseIndex: number;
};
export type Output = {
  readonly indexRatio: number;
  readonly adjustedTariff: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    baseTariff: { type: "number" },
    fuelShare: { type: "number", minimum: 0, maximum: 1 },
    currentIndex: { type: "number", minimum: 0 },
    baseIndex: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["baseTariff", "fuelShare", "currentIndex", "baseIndex"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    indexRatio: { type: "number" },
    adjustedTariff: { type: "number" },
  },
  required: ["indexRatio", "adjustedTariff"],
} as const;
/** Calculate fuel indexed tariff one factor term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { baseTariff, fuelShare, currentIndex, baseIndex } = request;
  const compute = (): Output => {
    H.probability(fuelShare);
    H.positive(baseIndex);
    H.domain(currentIndex >= 0);
    return {
      indexRatio: currentIndex / baseIndex,
      adjustedTariff:
        baseTariff * (1 - fuelShare + (fuelShare * currentIndex) / baseIndex),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { baseTariff: 100, fuelShare: 0.4, currentIndex: 150, baseIndex: 100 },
  output: { indexRatio: 1.5, adjustedTariff: 120 },
} satisfies ToolExample<Input, Output>;
export const fuelIndexedTariffOneFactorTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "energy-economics/fuel-indexed-tariff-one-factor-term",
    title: "Fuel Indexed Tariff One Factor Term Tool",
    description:
      "Calculate fuel indexed tariff one factor term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        baseTariff: { type: "number" },
        fuelShare: { type: "number", minimum: 0, maximum: 1 },
        currentIndex: { type: "number", minimum: 0 },
        baseIndex: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["baseTariff", "fuelShare", "currentIndex", "baseIndex"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        indexRatio: { type: "number" },
        adjustedTariff: { type: "number" },
      },
      required: ["indexRatio", "adjustedTariff"],
    },
    ports: {
      inputs: [
        {
          id: "baseTariff",
          label: "Base Tariff",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "fuelShare",
          label: "Fuel Share",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "currentIndex",
          label: "Current Index",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "baseIndex",
          label: "Base Index",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "indexRatio",
          label: "Index Ratio",
          valueType: { type: "number" },
        },
        {
          id: "adjustedTariff",
          label: "Adjusted Tariff",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = fuelIndexedTariffOneFactorTermTool.execute;
export default fuelIndexedTariffOneFactorTermTool;
