import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly grossBedVolume: number;
  readonly solidFraction: number;
  readonly drainedFraction: number;
};
export type Output = {
  readonly poreVolume: number;
  readonly drainableVolume: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grossBedVolume: { type: "number", minimum: 0 },
    solidFraction: { type: "number", minimum: 0, maximum: 1 },
    drainedFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["grossBedVolume", "solidFraction", "drainedFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    poreVolume: { type: "number" },
    drainableVolume: { type: "number" },
  },
  required: ["poreVolume", "drainableVolume"],
} as const;
/** Calculate growbed flood drain volume share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { grossBedVolume, solidFraction, drainedFraction } = request;
  const compute = (): Output => {
    H.domain(grossBedVolume >= 0);
    H.probability(solidFraction);
    H.probability(drainedFraction);
    return {
      poreVolume: grossBedVolume * (1 - solidFraction),
      drainableVolume: grossBedVolume * (1 - solidFraction) * drainedFraction,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { grossBedVolume: 100, solidFraction: 0.6, drainedFraction: 0.8 },
  output: { poreVolume: 40, drainableVolume: 32 },
} satisfies ToolExample<Input, Output>;
export const growbedFloodDrainVolumeShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hydroponics/growbed-flood-drain-volume-share",
    title: "Growbed Flood Drain Volume Share Tool",
    description:
      "Calculate growbed flood drain volume share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        grossBedVolume: { type: "number", minimum: 0 },
        solidFraction: { type: "number", minimum: 0, maximum: 1 },
        drainedFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["grossBedVolume", "solidFraction", "drainedFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        poreVolume: { type: "number" },
        drainableVolume: { type: "number" },
      },
      required: ["poreVolume", "drainableVolume"],
    },
    ports: {
      inputs: [
        {
          id: "grossBedVolume",
          label: "Gross Bed Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "solidFraction",
          label: "Solid Fraction",
          required: true,
          valueType: { type: "number", unit: "1" },
        },
        {
          id: "drainedFraction",
          label: "Drained Fraction",
          required: true,
          valueType: { type: "number", unit: "1" },
        },
      ],
      outputs: [
        {
          id: "poreVolume",
          label: "Pore Volume",
          valueType: { type: "number" },
        },
        {
          id: "drainableVolume",
          label: "Drainable Volume",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = growbedFloodDrainVolumeShareTool.execute;
export default growbedFloodDrainVolumeShareTool;
