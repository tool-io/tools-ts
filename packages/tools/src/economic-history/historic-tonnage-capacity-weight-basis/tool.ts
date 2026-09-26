import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly volume: number;
  readonly volumePerRegisterTon: number;
  readonly cargoMass: number;
  readonly massPerWeightTon: number;
};
export type Output = {
  readonly registerTons: number;
  readonly weightTons: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    volume: { type: "number", minimum: 0 },
    volumePerRegisterTon: { type: "number", exclusiveMinimum: 0 },
    cargoMass: { type: "number", minimum: 0 },
    massPerWeightTon: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["volume", "volumePerRegisterTon", "cargoMass", "massPerWeightTon"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    registerTons: { type: "number" },
    weightTons: { type: "number" },
  },
  required: ["registerTons", "weightTons"],
} as const;
/** Separate volume-based registered tonnage and weight-based cargo tonnage using caller-sourced unit definitions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { volume, volumePerRegisterTon, cargoMass, massPerWeightTon } = request;
  const compute = (): Output => {
    H.domain(volume >= 0 && cargoMass >= 0);
    H.positive(volumePerRegisterTon);
    H.positive(massPerWeightTon);
    return {
      registerTons: volume / volumePerRegisterTon,
      weightTons: cargoMass / massPerWeightTon,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    volume: 300,
    volumePerRegisterTon: 3,
    cargoMass: 2000,
    massPerWeightTon: 1000,
  },
  output: { registerTons: 100, weightTons: 2 },
} satisfies ToolExample<Input, Output>;
export const historicTonnageCapacityWeightBasisTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "economic-history/historic-tonnage-capacity-weight-basis",
    title: "Historic Tonnage Capacity Weight Basis Tool",
    description:
      "Separate volume-based registered tonnage and weight-based cargo tonnage using caller-sourced unit definitions.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        volume: { type: "number", minimum: 0 },
        volumePerRegisterTon: { type: "number", exclusiveMinimum: 0 },
        cargoMass: { type: "number", minimum: 0 },
        massPerWeightTon: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "volume",
        "volumePerRegisterTon",
        "cargoMass",
        "massPerWeightTon",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        registerTons: { type: "number" },
        weightTons: { type: "number" },
      },
      required: ["registerTons", "weightTons"],
    },
    ports: {
      inputs: [
        {
          id: "volume",
          label: "Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "volumePerRegisterTon",
          label: "Volume Per Register Ton",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "cargoMass",
          label: "Cargo Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "massPerWeightTon",
          label: "Mass Per Weight Ton",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "registerTons",
          label: "Register Tons",
          valueType: { type: "number" },
        },
        {
          id: "weightTons",
          label: "Weight Tons",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = historicTonnageCapacityWeightBasisTool.execute;
export default historicTonnageCapacityWeightBasisTool;
