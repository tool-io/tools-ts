import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly volumeInHInverseCubicUnits: number;
  readonly hValue: number;
};
export type Output = { readonly physicalCubicVolume: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    volumeInHInverseCubicUnits: { type: "number", minimum: 0 },
    hValue: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["volumeInHInverseCubicUnits", "hValue"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { physicalCubicVolume: { type: "number" } },
  required: ["physicalCubicVolume"],
} as const;
/** Convert a supplied comoving volume carrying h^-3 to the corresponding base cubic unit with explicit positive h. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { volumeInHInverseCubicUnits, hValue } = request;
  const compute = (): Output => {
    H.domain(volumeInHInverseCubicUnits >= 0, "volumeInHInverseCubicUnits");
    (H.domain(Number.isFinite(hValue) && hValue > 0, "hValue"), hValue);
    return {
      physicalCubicVolume:
        volumeInHInverseCubicUnits / hValue / hValue / hValue,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { volumeInHInverseCubicUnits: 8, hValue: 0.5 },
  output: { physicalCubicVolume: 64 },
} satisfies ToolExample<Input, Output>;
export const comovingVolumeHCubedUnitPairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["cosmology", "physics"],
      keywords: ["cosmology", "physics"],
    },
    id: "cosmology/comoving-volume-h-cubed-unit-pair",
    title: "Comoving Volume H Cubed Unit Pair",
    description:
      "Convert a supplied comoving volume carrying h^-3 to the corresponding base cubic unit with explicit positive h.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        volumeInHInverseCubicUnits: { type: "number", minimum: 0 },
        hValue: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["volumeInHInverseCubicUnits", "hValue"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { physicalCubicVolume: { type: "number" } },
      required: ["physicalCubicVolume"],
    },
    ports: {
      inputs: [
        {
          id: "volumeInHInverseCubicUnits",
          label: "Volume In HInverse Cubic Units",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "hValue",
          label: "H Value",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "physicalCubicVolume",
          label: "Physical Cubic Volume",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = comovingVolumeHCubedUnitPairTool.execute;
export default comovingVolumeHCubedUnitPairTool;
