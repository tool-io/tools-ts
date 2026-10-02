import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly pressureRms: number;
  readonly resistance: number;
  readonly reactance: number;
};
export type Output = { readonly intensity: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pressureRms: { type: "number", minimum: 0 },
    resistance: { type: "number", minimum: 0 },
    reactance: { type: "number" },
  },
  required: ["pressureRms", "resistance", "reactance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { intensity: { type: "number" } },
  required: ["intensity"],
} as const;
/** Compute mean active intensity from RMS pressure and supplied complex specific acoustic impedance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { pressureRms, resistance, reactance } = request;
  const compute = (): Output => {
    H.domain(pressureRms >= 0 && resistance >= 0);
    const d = resistance * resistance + reactance * reactance;
    H.positive(d);
    return { intensity: (pressureRms * pressureRms * resistance) / d };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { pressureRms: 2, resistance: 3, reactance: 4 },
  output: { intensity: 0.48 },
} satisfies ToolExample<Input, Output>;
export const acousticIntensityImpedanceFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "physics/acoustic-intensity-impedance-factor",
    title: "Acoustic Intensity Impedance Factor Tool",
    description:
      "Compute mean active intensity from RMS pressure and supplied complex specific acoustic impedance.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        pressureRms: { type: "number", minimum: 0 },
        resistance: { type: "number", minimum: 0 },
        reactance: { type: "number" },
      },
      required: ["pressureRms", "resistance", "reactance"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { intensity: { type: "number" } },
      required: ["intensity"],
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
          id: "resistance",
          label: "Resistance",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "reactance",
          label: "Reactance",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "intensity", label: "Intensity", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = acousticIntensityImpedanceFactorTool.execute;
export default acousticIntensityImpedanceFactorTool;
