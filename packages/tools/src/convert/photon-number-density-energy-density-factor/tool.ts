import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly numberDensity: number;
  readonly photonEnergy: number;
};
export type Output = { readonly energyDensity: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    numberDensity: { type: "number", minimum: 0 },
    photonEnergy: { type: "number", minimum: 0 },
  },
  required: ["numberDensity", "photonEnergy"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { energyDensity: { type: "number" } },
  required: ["energyDensity"],
} as const;
/** Convert a monochromatic photon number density and joules per photon into joules per cubic metre. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { numberDensity, photonEnergy } = input;
  const compute = (): Output => {
    H.domain(numberDensity >= 0 && photonEnergy >= 0);
    return { energyDensity: numberDensity * photonEnergy };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { numberDensity: 20, photonEnergy: 0.5 },
  output: { energyDensity: 10 },
} satisfies ToolExample<Input, Output>;
export const photonNumberDensityEnergyDensityFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "convert/photon-number-density-energy-density-factor",
      title: "Photon Number Density Energy Density Factor Tool",
      description:
        "Convert a monochromatic photon number density and joules per photon into joules per cubic metre.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          numberDensity: { type: "number", minimum: 0 },
          photonEnergy: { type: "number", minimum: 0 },
        },
        required: ["numberDensity", "photonEnergy"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { energyDensity: { type: "number" } },
        required: ["energyDensity"],
      },
      ports: {
        inputs: [
          {
            id: "numberDensity",
            label: "Number Density",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "photonEnergy",
            label: "Photon Energy",
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
        ],
      },
    },
    calculate,
  });
export const run = photonNumberDensityEnergyDensityFactorTool.execute;
export default photonNumberDensityEnergyDensityFactorTool;
