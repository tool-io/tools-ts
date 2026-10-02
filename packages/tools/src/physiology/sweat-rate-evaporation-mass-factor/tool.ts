import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly secretedMassKg: number;
  readonly evaporatedFraction: number;
  readonly latentHeatJPerKg: number;
  readonly durationSeconds: number;
};
export type Output = {
  readonly evaporatedMassKg: number;
  readonly heatRemovedJ: number;
  readonly meanCoolingW: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    secretedMassKg: { type: "number", minimum: 0 },
    evaporatedFraction: { type: "number", minimum: 0, maximum: 1 },
    latentHeatJPerKg: { type: "number", exclusiveMinimum: 0 },
    durationSeconds: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "secretedMassKg",
    "evaporatedFraction",
    "latentHeatJPerKg",
    "durationSeconds",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    evaporatedMassKg: { type: "number" },
    heatRemovedJ: { type: "number" },
    meanCoolingW: { type: "number" },
  },
  required: ["evaporatedMassKg", "heatRemovedJ", "meanCoolingW"],
} as const;
/** Evaporated fraction latent-heat accounting with supplied thermodynamic properties; no heat-stress or hydration advice. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    secretedMassKg,
    evaporatedFraction,
    latentHeatJPerKg,
    durationSeconds,
  } = request;
  const compute = (): Output => {
    H.domain(secretedMassKg >= 0);
    H.probability(evaporatedFraction);
    H.positive(latentHeatJPerKg);
    H.positive(durationSeconds);
    return {
      evaporatedMassKg: secretedMassKg * evaporatedFraction,
      heatRemovedJ: secretedMassKg * evaporatedFraction * latentHeatJPerKg,
      meanCoolingW:
        (secretedMassKg * evaporatedFraction * latentHeatJPerKg) /
        durationSeconds,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    secretedMassKg: 0.1,
    evaporatedFraction: 0.5,
    latentHeatJPerKg: 2400000,
    durationSeconds: 600,
  },
  output: { evaporatedMassKg: 0.05, heatRemovedJ: 120000, meanCoolingW: 200 },
} satisfies ToolExample<Input, Output>;
export const sweatRateEvaporationMassFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "physiology/sweat-rate-evaporation-mass-factor",
    title: "Sweat Rate Evaporation Mass Factor Tool",
    description:
      "Evaporated fraction latent-heat accounting with supplied thermodynamic properties; no heat-stress or hydration advice.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        secretedMassKg: { type: "number", minimum: 0 },
        evaporatedFraction: { type: "number", minimum: 0, maximum: 1 },
        latentHeatJPerKg: { type: "number", exclusiveMinimum: 0 },
        durationSeconds: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "secretedMassKg",
        "evaporatedFraction",
        "latentHeatJPerKg",
        "durationSeconds",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        evaporatedMassKg: { type: "number" },
        heatRemovedJ: { type: "number" },
        meanCoolingW: { type: "number" },
      },
      required: ["evaporatedMassKg", "heatRemovedJ", "meanCoolingW"],
    },
    ports: {
      inputs: [
        {
          id: "secretedMassKg",
          label: "Secreted Mass Kg",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "evaporatedFraction",
          label: "Evaporated Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "latentHeatJPerKg",
          label: "Latent Heat JPer Kg",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "durationSeconds",
          label: "Duration Seconds",
          required: true,
          valueType: { type: "number", unit: "s" },
        },
      ],
      outputs: [
        {
          id: "evaporatedMassKg",
          label: "Evaporated Mass Kg",
          valueType: { type: "number" },
        },
        {
          id: "heatRemovedJ",
          label: "Heat Removed J",
          valueType: { type: "number" },
        },
        {
          id: "meanCoolingW",
          label: "Mean Cooling W",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = sweatRateEvaporationMassFactorTool.execute;
export default sweatRateEvaporationMassFactorTool;
