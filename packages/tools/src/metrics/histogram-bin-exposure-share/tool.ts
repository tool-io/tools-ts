import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly binExposures: readonly number[];
  readonly selectedBin: number;
};
export type Output = {
  readonly totalExposure: number;
  readonly binShare: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    binExposures: {
      type: "array",
      maxItems: 256,
      items: { type: "number", minimum: 0 },
    },
    selectedBin: { type: "integer", minimum: 0 },
  },
  required: ["binExposures", "selectedBin"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalExposure: { type: "number" },
    binShare: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["totalExposure", "binShare", "defined"],
} as const;
/** Report one histogram bin’s explicitly supplied exposure share, with an undefined flag for no exposure. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { binExposures, selectedBin } = request;
  const compute = (): Output => {
    H.domain(binExposures.every((x) => x >= 0));
    H.integer(selectedBin, 0, binExposures.length - 1);
    return (() => {
      const totalExposure = binExposures.reduce((s, x) => s + x, 0);
      return {
        totalExposure,
        binShare:
          totalExposure > 0 ? binExposures[selectedBin] / totalExposure : 0,
        defined: totalExposure > 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { binExposures: [2, 3, 5], selectedBin: 1 },
  output: { totalExposure: 10, binShare: 0.3, defined: true },
} satisfies ToolExample<Input, Output>;
export const histogramBinExposureShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "metrics/histogram-bin-exposure-share",
    title: "Histogram Bin Exposure Share Tool",
    description:
      "Report one histogram bin’s explicitly supplied exposure share, with an undefined flag for no exposure.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        binExposures: {
          type: "array",
          maxItems: 256,
          items: { type: "number", minimum: 0 },
        },
        selectedBin: { type: "integer", minimum: 0 },
      },
      required: ["binExposures", "selectedBin"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalExposure: { type: "number" },
        binShare: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["totalExposure", "binShare", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "binExposures",
          label: "Bin Exposures",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "selectedBin",
          label: "Selected Bin",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "totalExposure",
          label: "Total Exposure",
          valueType: { type: "number" },
        },
        { id: "binShare", label: "Bin Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = histogramBinExposureShareTool.execute;
export default histogramBinExposureShareTool;
