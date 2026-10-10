import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly suppliedTableVolume: number;
  readonly suppliedCorrectionFactor: number;
};
export type Output = { readonly correctedVolume: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    suppliedTableVolume: { type: "number", minimum: 0 },
    suppliedCorrectionFactor: { type: "number", minimum: 0 },
  },
  required: ["suppliedTableVolume", "suppliedCorrectionFactor"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { correctedVolume: { type: "number" } },
  required: ["correctedVolume"],
} as const;
/** Apply an explicit correction factor to a supplied tank-table volume without deriving sounding tables or trim corrections. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { suppliedTableVolume, suppliedCorrectionFactor } = request;
  const compute = (): Output => {
    H.domain(
      suppliedTableVolume >= 0 && suppliedCorrectionFactor >= 0,
      "suppliedTableVolume",
    );
    return { correctedVolume: suppliedTableVolume * suppliedCorrectionFactor };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { suppliedTableVolume: 120, suppliedCorrectionFactor: 0.95 },
  output: { correctedVolume: 114 },
} satisfies ToolExample<Input, Output>;
export const tankSoundingVolumeFactorApplyTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["nautical", "engineering"],
      keywords: ["nautical", "engineering"],
    },
    id: "nautical/tank-sounding-volume-factor-apply",
    title: "Tank Sounding Volume Factor Apply",
    description:
      "Apply an explicit correction factor to a supplied tank-table volume without deriving sounding tables or trim corrections.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        suppliedTableVolume: { type: "number", minimum: 0 },
        suppliedCorrectionFactor: { type: "number", minimum: 0 },
      },
      required: ["suppliedTableVolume", "suppliedCorrectionFactor"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { correctedVolume: { type: "number" } },
      required: ["correctedVolume"],
    },
    ports: {
      inputs: [
        {
          id: "suppliedTableVolume",
          label: "Supplied Table Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedCorrectionFactor",
          label: "Supplied Correction Factor",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "correctedVolume",
          label: "Corrected Volume",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = tankSoundingVolumeFactorApplyTool.execute;
export default tankSoundingVolumeFactorApplyTool;
