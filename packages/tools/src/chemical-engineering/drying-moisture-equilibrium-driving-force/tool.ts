import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly moistureDryBasis: number;
  readonly equilibriumDryBasis: number;
  readonly criticalDryBasis: number;
};
export type Output = {
  readonly freeMoisture: number;
  readonly freeMoistureRatio: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    moistureDryBasis: { type: "number", minimum: 0 },
    equilibriumDryBasis: { type: "number", minimum: 0 },
    criticalDryBasis: { type: "number" },
  },
  required: ["moistureDryBasis", "equilibriumDryBasis", "criticalDryBasis"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    freeMoisture: { type: "number" },
    freeMoistureRatio: { type: "number" },
  },
  required: ["freeMoisture", "freeMoistureRatio"],
} as const;
/** Dry-basis mass ratios with signed free moisture; no drying-rate regime is inferred from a ratio alone. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { moistureDryBasis, equilibriumDryBasis, criticalDryBasis } = request;
  const compute = (): Output => {
    H.domain(
      moistureDryBasis >= 0 &&
        equilibriumDryBasis >= 0 &&
        criticalDryBasis > equilibriumDryBasis,
    );
    return {
      freeMoisture: moistureDryBasis - equilibriumDryBasis,
      freeMoistureRatio:
        (moistureDryBasis - equilibriumDryBasis) /
        (criticalDryBasis - equilibriumDryBasis),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    moistureDryBasis: 0.3,
    equilibriumDryBasis: 0.1,
    criticalDryBasis: 0.5,
  },
  output: {
    freeMoisture: 0.19999999999999998,
    freeMoistureRatio: 0.49999999999999994,
  },
} satisfies ToolExample<Input, Output>;
export const dryingMoistureEquilibriumDrivingForceTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "chemical-engineering/drying-moisture-equilibrium-driving-force",
      title: "Drying Moisture Equilibrium Driving Force Tool",
      description:
        "Dry-basis mass ratios with signed free moisture; no drying-rate regime is inferred from a ratio alone.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          moistureDryBasis: { type: "number", minimum: 0 },
          equilibriumDryBasis: { type: "number", minimum: 0 },
          criticalDryBasis: { type: "number" },
        },
        required: [
          "moistureDryBasis",
          "equilibriumDryBasis",
          "criticalDryBasis",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          freeMoisture: { type: "number" },
          freeMoistureRatio: { type: "number" },
        },
        required: ["freeMoisture", "freeMoistureRatio"],
      },
      ports: {
        inputs: [
          {
            id: "moistureDryBasis",
            label: "Moisture Dry Basis",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "equilibriumDryBasis",
            label: "Equilibrium Dry Basis",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "criticalDryBasis",
            label: "Critical Dry Basis",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "freeMoisture",
            label: "Free Moisture",
            valueType: { type: "number" },
          },
          {
            id: "freeMoistureRatio",
            label: "Free Moisture Ratio",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = dryingMoistureEquilibriumDrivingForceTool.execute;
export default dryingMoistureEquilibriumDrivingForceTool;
