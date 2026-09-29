import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly rainMassKg: number;
  readonly rainTemperatureC: number;
  readonly waterSpecificHeat: number;
  readonly latentHeatFusion: number;
  readonly availableSnowKg: number;
};
export type Output = {
  readonly sensibleHeatJ: number;
  readonly potentialMeltKg: number;
  readonly boundedMeltKg: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rainMassKg: { type: "number", minimum: 0 },
    rainTemperatureC: { type: "number", minimum: 0 },
    waterSpecificHeat: { type: "number", exclusiveMinimum: 0 },
    latentHeatFusion: { type: "number", exclusiveMinimum: 0 },
    availableSnowKg: { type: "number", minimum: 0 },
  },
  required: [
    "rainMassKg",
    "rainTemperatureC",
    "waterSpecificHeat",
    "latentHeatFusion",
    "availableSnowKg",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sensibleHeatJ: { type: "number" },
    potentialMeltKg: { type: "number" },
    boundedMeltKg: { type: "number" },
  },
  required: ["sensibleHeatJ", "potentialMeltKg", "boundedMeltKg"],
} as const;
/** Rain sensible heat cooling to zero Celsius available for melting snow already at zero, excluding all other energy fluxes. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    rainMassKg,
    rainTemperatureC,
    waterSpecificHeat,
    latentHeatFusion,
    availableSnowKg,
  } = request;
  const compute = (): Output => {
    H.domain(rainMassKg >= 0 && rainTemperatureC >= 0 && availableSnowKg >= 0);
    H.positive(waterSpecificHeat);
    H.positive(latentHeatFusion);
    return {
      sensibleHeatJ: rainMassKg * rainTemperatureC * waterSpecificHeat,
      potentialMeltKg:
        (rainMassKg * rainTemperatureC * waterSpecificHeat) / latentHeatFusion,
      boundedMeltKg: Math.min(
        availableSnowKg,
        (rainMassKg * rainTemperatureC * waterSpecificHeat) / latentHeatFusion,
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    rainMassKg: 10,
    rainTemperatureC: 5,
    waterSpecificHeat: 4200,
    latentHeatFusion: 334000,
    availableSnowKg: 2,
  },
  output: {
    sensibleHeatJ: 210000,
    potentialMeltKg: 0.6287425149700598,
    boundedMeltKg: 0.6287425149700598,
  },
} satisfies ToolExample<Input, Output>;
export const rainOnSnowHeatBudgetTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hydrometeorology/rain-on-snow-heat-budget-term",
    title: "Rain On Snow Heat Budget Term Tool",
    description:
      "Rain sensible heat cooling to zero Celsius available for melting snow already at zero, excluding all other energy fluxes.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rainMassKg: { type: "number", minimum: 0 },
        rainTemperatureC: { type: "number", minimum: 0 },
        waterSpecificHeat: { type: "number", exclusiveMinimum: 0 },
        latentHeatFusion: { type: "number", exclusiveMinimum: 0 },
        availableSnowKg: { type: "number", minimum: 0 },
      },
      required: [
        "rainMassKg",
        "rainTemperatureC",
        "waterSpecificHeat",
        "latentHeatFusion",
        "availableSnowKg",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sensibleHeatJ: { type: "number" },
        potentialMeltKg: { type: "number" },
        boundedMeltKg: { type: "number" },
      },
      required: ["sensibleHeatJ", "potentialMeltKg", "boundedMeltKg"],
    },
    ports: {
      inputs: [
        {
          id: "rainMassKg",
          label: "Rain Mass Kg",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "rainTemperatureC",
          label: "Rain Temperature C",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "waterSpecificHeat",
          label: "Water Specific Heat",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "latentHeatFusion",
          label: "Latent Heat Fusion",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "availableSnowKg",
          label: "Available Snow Kg",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "sensibleHeatJ",
          label: "Sensible Heat J",
          valueType: { type: "number" },
        },
        {
          id: "potentialMeltKg",
          label: "Potential Melt Kg",
          valueType: { type: "number" },
        },
        {
          id: "boundedMeltKg",
          label: "Bounded Melt Kg",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = rainOnSnowHeatBudgetTermTool.execute;
export default rainOnSnowHeatBudgetTermTool;
