import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly modulus: number;
  readonly strain: number;
  readonly volume: number;
};
export type Output = {
  readonly energyDensity: number;
  readonly energy: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    modulus: { type: "number", minimum: 0 },
    strain: { type: "number" },
    volume: { type: "number", minimum: 0 },
  },
  required: ["modulus", "strain", "volume"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { energyDensity: { type: "number" }, energy: { type: "number" } },
  required: ["energyDensity", "energy"],
} as const;
/** Return one linear elastic uniaxial mode energy, excluding plasticity and multiaxial coupling. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { modulus, strain, volume } = request;
  const compute = (): Output => {
    H.domain(modulus >= 0 && volume >= 0);
    const energyDensity = (modulus * strain * strain) / 2;
    return { energyDensity, energy: energyDensity * volume };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { modulus: 200000000000, strain: 0.001, volume: 0.000001 },
  output: { energyDensity: 100000, energy: 0.09999999999999999 },
} satisfies ToolExample<Input, Output>;
export const elasticEnergyStrainOneModeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "physics/elastic-energy-strain-one-mode",
    title: "Elastic Energy Strain One Mode Tool",
    description:
      "Return one linear elastic uniaxial mode energy, excluding plasticity and multiaxial coupling.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        modulus: { type: "number", minimum: 0 },
        strain: { type: "number" },
        volume: { type: "number", minimum: 0 },
      },
      required: ["modulus", "strain", "volume"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        energyDensity: { type: "number" },
        energy: { type: "number" },
      },
      required: ["energyDensity", "energy"],
    },
    ports: {
      inputs: [
        {
          id: "modulus",
          label: "Modulus",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "strain",
          label: "Strain",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "volume",
          label: "Volume",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "energyDensity",
          label: "Energy Density",
          valueType: { type: "number" },
        },
        { id: "energy", label: "Energy", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = elasticEnergyStrainOneModeTool.execute;
export default elasticEnergyStrainOneModeTool;
