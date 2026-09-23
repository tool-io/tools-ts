import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly bedVolume: number;
  readonly voidFraction: number;
  readonly particleDensity: number;
};
export type Output = {
  readonly voidVolume: number;
  readonly solidVolume: number;
  readonly solidMass: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    bedVolume: { type: "number", minimum: 0 },
    voidFraction: { type: "number", minimum: 0, maximum: 1 },
    particleDensity: { type: "number", minimum: 0 },
  },
  required: ["bedVolume", "voidFraction", "particleDensity"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    voidVolume: { type: "number" },
    solidVolume: { type: "number" },
    solidMass: { type: "number" },
  },
  required: ["voidVolume", "solidVolume", "solidMass"],
} as const;
/** Calculate packed bed voidage solid volume factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { bedVolume, voidFraction, particleDensity } = request;
  const compute = (): Output => {
    H.domain(bedVolume >= 0 && particleDensity >= 0);
    H.probability(voidFraction);
    return {
      voidVolume: bedVolume * voidFraction,
      solidVolume: bedVolume * (1 - voidFraction),
      solidMass: bedVolume * (1 - voidFraction) * particleDensity,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { bedVolume: 10, voidFraction: 0.4, particleDensity: 2 },
  output: { voidVolume: 4, solidVolume: 6, solidMass: 12 },
} satisfies ToolExample<Input, Output>;
export const packedBedVoidageSolidVolumeFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "chemical-engineering/packed-bed-voidage-solid-volume-factor",
    title: "Packed BED Voidage Solid Volume Factor Tool",
    description:
      "Calculate packed bed voidage solid volume factor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        bedVolume: { type: "number", minimum: 0 },
        voidFraction: { type: "number", minimum: 0, maximum: 1 },
        particleDensity: { type: "number", minimum: 0 },
      },
      required: ["bedVolume", "voidFraction", "particleDensity"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        voidVolume: { type: "number" },
        solidVolume: { type: "number" },
        solidMass: { type: "number" },
      },
      required: ["voidVolume", "solidVolume", "solidMass"],
    },
    ports: {
      inputs: [
        {
          id: "bedVolume",
          label: "Bed Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "voidFraction",
          label: "Void Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "particleDensity",
          label: "Particle Density",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "voidVolume",
          label: "Void Volume",
          valueType: { type: "number" },
        },
        {
          id: "solidVolume",
          label: "Solid Volume",
          valueType: { type: "number" },
        },
        { id: "solidMass", label: "Solid Mass", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = packedBedVoidageSolidVolumeFactorTool.execute;
export default packedBedVoidageSolidVolumeFactorTool;
