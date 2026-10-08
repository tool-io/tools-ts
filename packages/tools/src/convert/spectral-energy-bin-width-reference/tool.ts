import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly energyDensityPerHertz: number;
  readonly binWidthHertz: number;
};
export type Output = { readonly binEnergy: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    energyDensityPerHertz: { type: "number", minimum: 0 },
    binWidthHertz: { type: "number", minimum: 0 },
  },
  required: ["energyDensityPerHertz", "binWidthHertz"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { binEnergy: { type: "number" } },
  required: ["binEnergy"],
} as const;
/** Integrate an explicitly uniform energy density over a supplied frequency-bin width without changing spectral coordinate systems. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { energyDensityPerHertz, binWidthHertz } = request;
  const compute = (): Output => {
    H.domain(
      energyDensityPerHertz >= 0 && binWidthHertz >= 0,
      "energyDensityPerHertz",
    );
    return { binEnergy: energyDensityPerHertz * binWidthHertz };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { energyDensityPerHertz: 2.5, binWidthHertz: 4 },
  output: { binEnergy: 10 },
} satisfies ToolExample<Input, Output>;
export const spectralEnergyBinWidthReferenceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["encode-decode"],
      fields: ["convert", "unit conversion", "computer science"],
      keywords: ["unit conversion", "computer science"],
    },
    id: "convert/spectral-energy-bin-width-reference",
    title: "Spectral Energy Bin Width Reference",
    description:
      "Integrate an explicitly uniform energy density over a supplied frequency-bin width without changing spectral coordinate systems.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        energyDensityPerHertz: { type: "number", minimum: 0 },
        binWidthHertz: { type: "number", minimum: 0 },
      },
      required: ["energyDensityPerHertz", "binWidthHertz"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { binEnergy: { type: "number" } },
      required: ["binEnergy"],
    },
    ports: {
      inputs: [
        {
          id: "energyDensityPerHertz",
          label: "Energy Density Per Hertz",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "binWidthHertz",
          label: "Bin Width Hertz",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "binEnergy", label: "Bin Energy", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = spectralEnergyBinWidthReferenceTool.execute;
export default spectralEnergyBinWidthReferenceTool;
