import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly binVolume: number;
  readonly totalVolume: number;
  readonly excludedVolume: number;
  readonly excludeMarked: boolean;
};
export type Output = {
  readonly denominatorVolume: number;
  readonly share: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    binVolume: { type: "number", minimum: 0 },
    totalVolume: { type: "number", exclusiveMinimum: 0 },
    excludedVolume: { type: "number", minimum: 0 },
    excludeMarked: { type: "boolean" },
  },
  required: ["binVolume", "totalVolume", "excludedVolume", "excludeMarked"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    denominatorVolume: { type: "number" },
    share: { type: "number" },
  },
  required: ["denominatorVolume", "share"],
} as const;
/** Share of already supplied compatible comoving volumes; no distance-redshift cosmology is inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { binVolume, totalVolume, excludedVolume, excludeMarked } = request;
  const compute = (): Output => {
    H.positive(totalVolume);
    H.domain(
      binVolume >= 0 &&
        excludedVolume >= 0 &&
        excludedVolume < totalVolume &&
        binVolume <= totalVolume - excludedVolume,
    );
    return {
      denominatorVolume: totalVolume - (excludeMarked ? excludedVolume : 0),
      share: binVolume / (totalVolume - (excludeMarked ? excludedVolume : 0)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    binVolume: 20,
    totalVolume: 100,
    excludedVolume: 20,
    excludeMarked: true,
  },
  output: { denominatorVolume: 80, share: 0.25 },
} satisfies ToolExample<Input, Output>;
export const comovingBinVolumeShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "cosmology/comoving-bin-volume-share",
    title: "Comoving Bin Volume Share Tool",
    description:
      "Share of already supplied compatible comoving volumes; no distance-redshift cosmology is inferred.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        binVolume: { type: "number", minimum: 0 },
        totalVolume: { type: "number", exclusiveMinimum: 0 },
        excludedVolume: { type: "number", minimum: 0 },
        excludeMarked: { type: "boolean" },
      },
      required: ["binVolume", "totalVolume", "excludedVolume", "excludeMarked"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        denominatorVolume: { type: "number" },
        share: { type: "number" },
      },
      required: ["denominatorVolume", "share"],
    },
    ports: {
      inputs: [
        {
          id: "binVolume",
          label: "Bin Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "totalVolume",
          label: "Total Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "excludedVolume",
          label: "Excluded Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "excludeMarked",
          label: "Exclude Marked",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "denominatorVolume",
          label: "Denominator Volume",
          valueType: { type: "number" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = comovingBinVolumeShareTool.execute;
export default comovingBinVolumeShareTool;
