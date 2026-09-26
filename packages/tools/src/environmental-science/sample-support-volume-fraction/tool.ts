import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly supportedVolumes: readonly number[];
  readonly totalVolumes: readonly number[];
};
export type Output = {
  readonly supportedVolume: number;
  readonly totalVolume: number;
  readonly fraction: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    supportedVolumes: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
    totalVolumes: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["supportedVolumes", "totalVolumes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    supportedVolume: { type: "number" },
    totalVolume: { type: "number" },
    fraction: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["supportedVolume", "totalVolume", "fraction", "defined"],
} as const;
/** Aggregate explicitly supported sampling volumes with aligned whole-volume denominators. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { supportedVolumes, totalVolumes } = request;
  const compute = (): Output => {
    H.sameLength(supportedVolumes, totalVolumes);
    H.domain(supportedVolumes.every((x, i) => x >= 0 && totalVolumes[i] >= x));
    return (() => {
      const supportedVolume = supportedVolumes.reduce((a, b) => a + b, 0),
        totalVolume = totalVolumes.reduce((a, b) => a + b, 0);
      return {
        supportedVolume,
        totalVolume,
        fraction: totalVolume > 0 ? supportedVolume / totalVolume : 0,
        defined: totalVolume > 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { supportedVolumes: [1, 2], totalVolumes: [2, 3] },
  output: { supportedVolume: 3, totalVolume: 5, fraction: 0.6, defined: true },
} satisfies ToolExample<Input, Output>;
export const sampleSupportVolumeFractionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "environmental-science/sample-support-volume-fraction",
    title: "Sample Support Volume Fraction Tool",
    description:
      "Aggregate explicitly supported sampling volumes with aligned whole-volume denominators.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        supportedVolumes: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        totalVolumes: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
      },
      required: ["supportedVolumes", "totalVolumes"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        supportedVolume: { type: "number" },
        totalVolume: { type: "number" },
        fraction: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["supportedVolume", "totalVolume", "fraction", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "supportedVolumes",
          label: "Supported Volumes",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "totalVolumes",
          label: "Total Volumes",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        {
          id: "supportedVolume",
          label: "Supported Volume",
          valueType: { type: "number" },
        },
        {
          id: "totalVolume",
          label: "Total Volume",
          valueType: { type: "number" },
        },
        { id: "fraction", label: "Fraction", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = sampleSupportVolumeFractionTool.execute;
export default sampleSupportVolumeFractionTool;
