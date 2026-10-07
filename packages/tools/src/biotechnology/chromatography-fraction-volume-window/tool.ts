import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly startCollectedVolume: number;
  readonly endCollectedVolume: number;
};
export type Output = { readonly fractionVolume: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    startCollectedVolume: { type: "number", minimum: 0 },
    endCollectedVolume: { type: "number" },
  },
  required: ["startCollectedVolume", "endCollectedVolume"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { fractionVolume: { type: "number" } },
  required: ["fractionVolume"],
} as const;
/** Subtract explicit cumulative collection-volume boundaries for one fraction without selecting separation conditions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { startCollectedVolume, endCollectedVolume } = request;
  const compute = (): Output => {
    H.domain(
      startCollectedVolume >= 0 && endCollectedVolume >= startCollectedVolume,
      "startCollectedVolume",
    );
    return { fractionVolume: endCollectedVolume - startCollectedVolume };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { startCollectedVolume: 20, endCollectedVolume: 35 },
  output: { fractionVolume: 15 },
} satisfies ToolExample<Input, Output>;
export const chromatographyFractionVolumeWindowTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["biotechnology", "biology"],
      keywords: ["biotechnology", "biology"],
    },
    id: "biotechnology/chromatography-fraction-volume-window",
    title: "Chromatography Fraction Volume Window",
    description:
      "Subtract explicit cumulative collection-volume boundaries for one fraction without selecting separation conditions.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        startCollectedVolume: { type: "number", minimum: 0 },
        endCollectedVolume: { type: "number" },
      },
      required: ["startCollectedVolume", "endCollectedVolume"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { fractionVolume: { type: "number" } },
      required: ["fractionVolume"],
    },
    ports: {
      inputs: [
        {
          id: "startCollectedVolume",
          label: "Start Collected Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "endCollectedVolume",
          label: "End Collected Volume",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "fractionVolume",
          label: "Fraction Volume",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = chromatographyFractionVolumeWindowTool.execute;
export default chromatographyFractionVolumeWindowTool;
