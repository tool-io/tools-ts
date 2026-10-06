import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly baseAreaSquareMeters: number;
  readonly recordedWaterDepthMeters: number;
};
export type Output = { readonly waterVolumeLiters: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    baseAreaSquareMeters: { type: "number", minimum: 0 },
    recordedWaterDepthMeters: { type: "number", minimum: 0 },
  },
  required: ["baseAreaSquareMeters", "recordedWaterDepthMeters"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { waterVolumeLiters: { type: "number" } },
  required: ["waterVolumeLiters"],
} as const;
/** Calculate rectangular sump water volume from explicit constant base area and depth without setting operating levels. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { baseAreaSquareMeters, recordedWaterDepthMeters } = request;
  const compute = (): Output => {
    H.domain(
      baseAreaSquareMeters >= 0 && recordedWaterDepthMeters >= 0,
      "baseAreaSquareMeters",
    );
    return {
      waterVolumeLiters: baseAreaSquareMeters * recordedWaterDepthMeters * 1000,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { baseAreaSquareMeters: 1.5, recordedWaterDepthMeters: 0.4 },
  output: { waterVolumeLiters: 600.0000000000001 },
} satisfies ToolExample<Input, Output>;
export const aquaponicSumpLevelVolumeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["aquaponics", "agriculture"],
      keywords: ["aquaponics", "agriculture"],
    },
    id: "aquaponics/aquaponic-sump-level-volume",
    title: "Aquaponic Sump Level Volume",
    description:
      "Calculate rectangular sump water volume from explicit constant base area and depth without setting operating levels.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        baseAreaSquareMeters: { type: "number", minimum: 0 },
        recordedWaterDepthMeters: { type: "number", minimum: 0 },
      },
      required: ["baseAreaSquareMeters", "recordedWaterDepthMeters"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { waterVolumeLiters: { type: "number" } },
      required: ["waterVolumeLiters"],
    },
    ports: {
      inputs: [
        {
          id: "baseAreaSquareMeters",
          label: "Base Area Square Meters",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "recordedWaterDepthMeters",
          label: "Recorded Water Depth Meters",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "waterVolumeLiters",
          label: "Water Volume Liters",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = aquaponicSumpLevelVolumeTool.execute;
export default aquaponicSumpLevelVolumeTool;
