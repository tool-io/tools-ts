import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly snowMass: number;
  readonly temperatureBelowZero: number;
  readonly suppliedHeatCapacity: number;
  readonly latentHeat: number;
  readonly liquidMass: number;
};
export type Output = {
  readonly coldContent: number;
  readonly freezeCapacity: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    snowMass: { type: "number", minimum: 0 },
    temperatureBelowZero: { type: "number" },
    suppliedHeatCapacity: { type: "number", minimum: 0 },
    latentHeat: { type: "number", exclusiveMinimum: 0 },
    liquidMass: { type: "number", minimum: 0 },
  },
  required: [
    "snowMass",
    "temperatureBelowZero",
    "suppliedHeatCapacity",
    "latentHeat",
    "liquidMass",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    coldContent: { type: "number" },
    freezeCapacity: { type: "number" },
  },
  required: ["coldContent", "freezeCapacity"],
} as const;
/** Ideal supplied cold-content/latent-heat mass budget, without a snowpack dynamics forecast. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    snowMass,
    temperatureBelowZero,
    suppliedHeatCapacity,
    latentHeat,
    liquidMass,
  } = request;
  const compute = (): Output => {
    H.domain(snowMass >= 0 && suppliedHeatCapacity >= 0 && liquidMass >= 0);
    H.positive(latentHeat);
    return {
      coldContent:
        snowMass * Math.max(0, -temperatureBelowZero) * suppliedHeatCapacity,
      freezeCapacity: Math.min(
        liquidMass,
        (snowMass * Math.max(0, -temperatureBelowZero) * suppliedHeatCapacity) /
          latentHeat,
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    snowMass: 100,
    temperatureBelowZero: -2,
    suppliedHeatCapacity: 2,
    latentHeat: 400,
    liquidMass: 5,
  },
  output: { coldContent: 400, freezeCapacity: 1 },
} satisfies ToolExample<Input, Output>;
export const snowLayerRefreezeCapacityTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hydrometeorology/snow-layer-refreeze-capacity-term",
    title: "Snow Layer Refreeze Capacity Term Tool",
    description:
      "Ideal supplied cold-content/latent-heat mass budget, without a snowpack dynamics forecast.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        snowMass: { type: "number", minimum: 0 },
        temperatureBelowZero: { type: "number" },
        suppliedHeatCapacity: { type: "number", minimum: 0 },
        latentHeat: { type: "number", exclusiveMinimum: 0 },
        liquidMass: { type: "number", minimum: 0 },
      },
      required: [
        "snowMass",
        "temperatureBelowZero",
        "suppliedHeatCapacity",
        "latentHeat",
        "liquidMass",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        coldContent: { type: "number" },
        freezeCapacity: { type: "number" },
      },
      required: ["coldContent", "freezeCapacity"],
    },
    ports: {
      inputs: [
        {
          id: "snowMass",
          label: "Snow Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "temperatureBelowZero",
          label: "Temperature Below Zero",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedHeatCapacity",
          label: "Supplied Heat Capacity",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "latentHeat",
          label: "Latent Heat",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "liquidMass",
          label: "Liquid Mass",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "coldContent",
          label: "Cold Content",
          valueType: { type: "number" },
        },
        {
          id: "freezeCapacity",
          label: "Freeze Capacity",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = snowLayerRefreezeCapacityTermTool.execute;
export default snowLayerRefreezeCapacityTermTool;
