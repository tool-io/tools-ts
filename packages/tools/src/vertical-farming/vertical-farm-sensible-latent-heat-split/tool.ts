import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly totalWatts: number;
  readonly sensibleWatts: number;
  readonly evaporationKgPerSecond: number;
  readonly latentJPerKg: number;
};
export type Output = {
  readonly latentWatts: number;
  readonly residualWatts: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalWatts: { type: "number", minimum: 0 },
    sensibleWatts: { type: "number", minimum: 0 },
    evaporationKgPerSecond: { type: "number", minimum: 0 },
    latentJPerKg: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "totalWatts",
    "sensibleWatts",
    "evaporationKgPerSecond",
    "latentJPerKg",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    latentWatts: { type: "number" },
    residualWatts: { type: "number" },
  },
  required: ["latentWatts", "residualWatts"],
} as const;
/** Reconcile supplied sensible/latent energy inventory without designing room conditions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { totalWatts, sensibleWatts, evaporationKgPerSecond, latentJPerKg } =
    request;
  const compute = (): Output => {
    H.domain(
      totalWatts >= 0 && sensibleWatts >= 0 && evaporationKgPerSecond >= 0,
    );
    H.positive(latentJPerKg);
    return {
      latentWatts: evaporationKgPerSecond * latentJPerKg,
      residualWatts:
        totalWatts - sensibleWatts - evaporationKgPerSecond * latentJPerKg,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    totalWatts: 1000,
    sensibleWatts: 400,
    evaporationKgPerSecond: 0.0002,
    latentJPerKg: 2400000,
  },
  output: { latentWatts: 480, residualWatts: 120 },
} satisfies ToolExample<Input, Output>;
export const verticalFarmSensibleLatentHeatSplitTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "vertical-farming/vertical-farm-sensible-latent-heat-split",
      title: "Vertical Farm Sensible Latent Heat Split Tool",
      description:
        "Reconcile supplied sensible/latent energy inventory without designing room conditions.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          totalWatts: { type: "number", minimum: 0 },
          sensibleWatts: { type: "number", minimum: 0 },
          evaporationKgPerSecond: { type: "number", minimum: 0 },
          latentJPerKg: { type: "number", exclusiveMinimum: 0 },
        },
        required: [
          "totalWatts",
          "sensibleWatts",
          "evaporationKgPerSecond",
          "latentJPerKg",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          latentWatts: { type: "number" },
          residualWatts: { type: "number" },
        },
        required: ["latentWatts", "residualWatts"],
      },
      ports: {
        inputs: [
          {
            id: "totalWatts",
            label: "Total Watts",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "sensibleWatts",
            label: "Sensible Watts",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "evaporationKgPerSecond",
            label: "Evaporation Kg Per Second",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "latentJPerKg",
            label: "Latent JPer Kg",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "latentWatts",
            label: "Latent Watts",
            valueType: { type: "number" },
          },
          {
            id: "residualWatts",
            label: "Residual Watts",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = verticalFarmSensibleLatentHeatSplitTool.execute;
export default verticalFarmSensibleLatentHeatSplitTool;
