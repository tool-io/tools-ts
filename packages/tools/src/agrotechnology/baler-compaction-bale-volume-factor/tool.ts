import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly looseVolume: number;
  readonly baleWidth: number;
  readonly baleHeight: number;
  readonly baleLength: number;
  readonly mass: number;
};
export type Output = {
  readonly baleVolume: number;
  readonly volumeRatio: number;
  readonly density: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    looseVolume: { type: "number", minimum: 0 },
    baleWidth: { type: "number", exclusiveMinimum: 0 },
    baleHeight: { type: "number", exclusiveMinimum: 0 },
    baleLength: { type: "number", exclusiveMinimum: 0 },
    mass: { type: "number", minimum: 0 },
  },
  required: ["looseVolume", "baleWidth", "baleHeight", "baleLength", "mass"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    baleVolume: { type: "number" },
    volumeRatio: { type: "number" },
    density: { type: "number" },
  },
  required: ["baleVolume", "volumeRatio", "density"],
} as const;
/** Calculate baler compaction bale volume factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { looseVolume, baleWidth, baleHeight, baleLength, mass } = request;
  const compute = (): Output => {
    H.domain(looseVolume >= 0 && mass >= 0);
    H.positive(baleWidth);
    H.positive(baleHeight);
    H.positive(baleLength);
    return {
      baleVolume: baleWidth * baleHeight * baleLength,
      volumeRatio: looseVolume / (baleWidth * baleHeight * baleLength),
      density: mass / (baleWidth * baleHeight * baleLength),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    looseVolume: 10,
    baleWidth: 1,
    baleHeight: 1,
    baleLength: 2,
    mass: 200,
  },
  output: { baleVolume: 2, volumeRatio: 5, density: 100 },
} satisfies ToolExample<Input, Output>;
export const balerCompactionBaleVolumeFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agrotechnology/baler-compaction-bale-volume-factor",
    title: "Baler Compaction Bale Volume Factor Tool",
    description:
      "Calculate baler compaction bale volume factor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        looseVolume: { type: "number", minimum: 0 },
        baleWidth: { type: "number", exclusiveMinimum: 0 },
        baleHeight: { type: "number", exclusiveMinimum: 0 },
        baleLength: { type: "number", exclusiveMinimum: 0 },
        mass: { type: "number", minimum: 0 },
      },
      required: [
        "looseVolume",
        "baleWidth",
        "baleHeight",
        "baleLength",
        "mass",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        baleVolume: { type: "number" },
        volumeRatio: { type: "number" },
        density: { type: "number" },
      },
      required: ["baleVolume", "volumeRatio", "density"],
    },
    ports: {
      inputs: [
        {
          id: "looseVolume",
          label: "Loose Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "baleWidth",
          label: "Bale Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "baleHeight",
          label: "Bale Height",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "baleLength",
          label: "Bale Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "mass",
          label: "Mass",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "baleVolume",
          label: "Bale Volume",
          valueType: { type: "number" },
        },
        {
          id: "volumeRatio",
          label: "Volume Ratio",
          valueType: { type: "number", unit: "1" },
        },
        { id: "density", label: "Density", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = balerCompactionBaleVolumeFactorTool.execute;
export default balerCompactionBaleVolumeFactorTool;
