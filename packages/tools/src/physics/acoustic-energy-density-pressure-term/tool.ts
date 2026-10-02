import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly pressureRms: number;
  readonly density: number;
  readonly soundSpeed: number;
};
export type Output = {
  readonly potentialEnergyDensity: number;
  readonly totalPlaneWaveDensity: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pressureRms: { type: "number", minimum: 0 },
    density: { type: "number", exclusiveMinimum: 0 },
    soundSpeed: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["pressureRms", "density", "soundSpeed"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    potentialEnergyDensity: { type: "number" },
    totalPlaneWaveDensity: { type: "number" },
  },
  required: ["potentialEnergyDensity", "totalPlaneWaveDensity"],
} as const;
/** Return mean potential and total acoustic energy densities for a progressive linear plane wave using RMS pressure. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { pressureRms, density, soundSpeed } = request;
  const compute = (): Output => {
    H.domain(pressureRms >= 0);
    H.positive(density);
    H.positive(soundSpeed);
    const totalPlaneWaveDensity =
      (pressureRms * pressureRms) / (density * soundSpeed * soundSpeed);
    return {
      potentialEnergyDensity: totalPlaneWaveDensity / 2,
      totalPlaneWaveDensity,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { pressureRms: 2, density: 2, soundSpeed: 2 },
  output: { potentialEnergyDensity: 0.25, totalPlaneWaveDensity: 0.5 },
} satisfies ToolExample<Input, Output>;
export const acousticEnergyDensityPressureTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "physics/acoustic-energy-density-pressure-term",
    title: "Acoustic Energy Density Pressure Term Tool",
    description:
      "Return mean potential and total acoustic energy densities for a progressive linear plane wave using RMS pressure.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        pressureRms: { type: "number", minimum: 0 },
        density: { type: "number", exclusiveMinimum: 0 },
        soundSpeed: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["pressureRms", "density", "soundSpeed"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        potentialEnergyDensity: { type: "number" },
        totalPlaneWaveDensity: { type: "number" },
      },
      required: ["potentialEnergyDensity", "totalPlaneWaveDensity"],
    },
    ports: {
      inputs: [
        {
          id: "pressureRms",
          label: "Pressure Rms",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "density",
          label: "Density",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "soundSpeed",
          label: "Sound Speed",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "potentialEnergyDensity",
          label: "Potential Energy Density",
          valueType: { type: "number" },
        },
        {
          id: "totalPlaneWaveDensity",
          label: "Total Plane Wave Density",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = acousticEnergyDensityPressureTermTool.execute;
export default acousticEnergyDensityPressureTermTool;
