import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly waterVolume: number;
  readonly activeDose: number;
  readonly stockPurity: number;
  readonly stockDensity: number;
};
export type Output = {
  readonly activeMass: number;
  readonly stockMass: number;
  readonly stockVolume: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    waterVolume: { type: "number", minimum: 0 },
    activeDose: { type: "number", minimum: 0 },
    stockPurity: { type: "number", exclusiveMinimum: 0, maximum: 1 },
    stockDensity: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["waterVolume", "activeDose", "stockPurity", "stockDensity"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    activeMass: { type: "number" },
    stockMass: { type: "number" },
    stockVolume: { type: "number" },
  },
  required: ["activeMass", "stockMass", "stockVolume"],
} as const;
/** Chemical stock requirement in matched mass and volume units with explicit active mass fraction and solution density. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { waterVolume, activeDose, stockPurity, stockDensity } = request;
  const compute = (): Output => {
    H.domain(
      waterVolume >= 0 &&
        activeDose >= 0 &&
        stockPurity > 0 &&
        stockPurity <= 1,
    );
    H.positive(stockDensity);
    return {
      activeMass: waterVolume * activeDose,
      stockMass: (waterVolume * activeDose) / stockPurity,
      stockVolume: (waterVolume * activeDose) / (stockPurity * stockDensity),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    waterVolume: 100,
    activeDose: 0.02,
    stockPurity: 0.1,
    stockDensity: 1.2,
  },
  output: { activeMass: 2, stockMass: 20, stockVolume: 16.666666666666668 },
} satisfies ToolExample<Input, Output>;
export const waterTreatmentChemicalStockPurityTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "environmental-engineering/water-treatment-chemical-stock-purity-term",
      title: "Water Treatment Chemical Stock Purity Term Tool",
      description:
        "Chemical stock requirement in matched mass and volume units with explicit active mass fraction and solution density.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          waterVolume: { type: "number", minimum: 0 },
          activeDose: { type: "number", minimum: 0 },
          stockPurity: { type: "number", exclusiveMinimum: 0, maximum: 1 },
          stockDensity: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["waterVolume", "activeDose", "stockPurity", "stockDensity"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          activeMass: { type: "number" },
          stockMass: { type: "number" },
          stockVolume: { type: "number" },
        },
        required: ["activeMass", "stockMass", "stockVolume"],
      },
      ports: {
        inputs: [
          {
            id: "waterVolume",
            label: "Water Volume",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "activeDose",
            label: "Active Dose",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "stockPurity",
            label: "Stock Purity",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "stockDensity",
            label: "Stock Density",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "activeMass",
            label: "Active Mass",
            valueType: { type: "number" },
          },
          {
            id: "stockMass",
            label: "Stock Mass",
            valueType: { type: "number" },
          },
          {
            id: "stockVolume",
            label: "Stock Volume",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = waterTreatmentChemicalStockPurityTermTool.execute;
export default waterTreatmentChemicalStockPurityTermTool;
