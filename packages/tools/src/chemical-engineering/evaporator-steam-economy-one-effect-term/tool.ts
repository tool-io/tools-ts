import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly evaporatedMass: number;
  readonly steamMass: number;
  readonly steamLatentHeat: number;
  readonly vaporLatentHeat: number;
};
export type Output = {
  readonly steamEconomy: number;
  readonly latentEfficiency: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    evaporatedMass: { type: "number", minimum: 0 },
    steamMass: { type: "number", exclusiveMinimum: 0 },
    steamLatentHeat: { type: "number", exclusiveMinimum: 0 },
    vaporLatentHeat: { type: "number", minimum: 0 },
  },
  required: [
    "evaporatedMass",
    "steamMass",
    "steamLatentHeat",
    "vaporLatentHeat",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    steamEconomy: { type: "number" },
    latentEfficiency: { type: "number" },
  },
  required: ["steamEconomy", "latentEfficiency"],
} as const;
/** One-effect mass and latent-energy ratios; sensible heating and external losses are not independently modeled. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { evaporatedMass, steamMass, steamLatentHeat, vaporLatentHeat } =
    request;
  const compute = (): Output => {
    H.domain(evaporatedMass >= 0);
    H.positive(steamMass);
    H.positive(steamLatentHeat);
    H.domain(vaporLatentHeat >= 0);
    return {
      steamEconomy: evaporatedMass / steamMass,
      latentEfficiency:
        (evaporatedMass * vaporLatentHeat) / (steamMass * steamLatentHeat),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    evaporatedMass: 80,
    steamMass: 100,
    steamLatentHeat: 2200,
    vaporLatentHeat: 2000,
  },
  output: { steamEconomy: 0.8, latentEfficiency: 0.7272727272727273 },
} satisfies ToolExample<Input, Output>;
export const evaporatorSteamEconomyOneEffectTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "chemical-engineering/evaporator-steam-economy-one-effect-term",
      title: "Evaporator Steam Economy One Effect Term Tool",
      description:
        "One-effect mass and latent-energy ratios; sensible heating and external losses are not independently modeled.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          evaporatedMass: { type: "number", minimum: 0 },
          steamMass: { type: "number", exclusiveMinimum: 0 },
          steamLatentHeat: { type: "number", exclusiveMinimum: 0 },
          vaporLatentHeat: { type: "number", minimum: 0 },
        },
        required: [
          "evaporatedMass",
          "steamMass",
          "steamLatentHeat",
          "vaporLatentHeat",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          steamEconomy: { type: "number" },
          latentEfficiency: { type: "number" },
        },
        required: ["steamEconomy", "latentEfficiency"],
      },
      ports: {
        inputs: [
          {
            id: "evaporatedMass",
            label: "Evaporated Mass",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "steamMass",
            label: "Steam Mass",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "steamLatentHeat",
            label: "Steam Latent Heat",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "vaporLatentHeat",
            label: "Vapor Latent Heat",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "steamEconomy",
            label: "Steam Economy",
            valueType: { type: "number" },
          },
          {
            id: "latentEfficiency",
            label: "Latent Efficiency",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = evaporatorSteamEconomyOneEffectTermTool.execute;
export default evaporatorSteamEconomyOneEffectTermTool;
