import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly spikeMass: number; readonly nativeMass: number };
export type Output = { readonly spikeToNativeRatio: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    spikeMass: { type: "number", minimum: 0 },
    nativeMass: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["spikeMass", "nativeMass"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { spikeToNativeRatio: { type: "number" } },
  required: ["spikeToNativeRatio"],
} as const;
/** Divide supplied geochemical spike mass by positive native-analyte mass on a consistent elemental or isotope basis. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { spikeMass, nativeMass } = request;
  const compute = (): Output => {
    H.domain(spikeMass >= 0, "spikeMass");
    (H.domain(Number.isFinite(nativeMass) && nativeMass > 0, "nativeMass"),
      nativeMass);
    return { spikeToNativeRatio: spikeMass / nativeMass };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { spikeMass: 3, nativeMass: 12 },
  output: { spikeToNativeRatio: 0.25 },
} satisfies ToolExample<Input, Output>;
export const geochemicalSpikeNativeMassRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geochemistry/geochemical-spike-native-mass-ratio",
    title: "Geochemical Spike Native Mass Ratio Tool",
    description:
      "Divide supplied geochemical spike mass by positive native-analyte mass on a consistent elemental or isotope basis.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        spikeMass: { type: "number", minimum: 0 },
        nativeMass: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["spikeMass", "nativeMass"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { spikeToNativeRatio: { type: "number" } },
      required: ["spikeToNativeRatio"],
    },
    ports: {
      inputs: [
        {
          id: "spikeMass",
          label: "Spike Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "nativeMass",
          label: "Native Mass",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "spikeToNativeRatio",
          label: "Spike To Native Ratio",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = geochemicalSpikeNativeMassRatioTool.execute;
export default geochemicalSpikeNativeMassRatioTool;
