import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly firstBin: number; readonly secondBin: number };
export type Output = {
  readonly overlap: number;
  readonly firstResidual: number;
  readonly secondResidual: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstBin: { type: "number", minimum: 0 },
    secondBin: { type: "number", minimum: 0 },
  },
  required: ["firstBin", "secondBin"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    overlap: { type: "number" },
    firstResidual: { type: "number" },
    secondResidual: { type: "number" },
  },
  required: ["overlap", "firstResidual", "secondResidual"],
} as const;
/** Partition two explicit nonnegative histogram bin masses into overlap and one-sided residuals without normalizing histograms. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstBin, secondBin } = request;
  const compute = (): Output => {
    H.domain(firstBin >= 0 && secondBin >= 0, "firstBin");
    return {
      overlap: Math.min(firstBin, secondBin),
      firstResidual: Math.max(0, firstBin - secondBin),
      secondResidual: Math.max(0, secondBin - firstBin),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstBin: 3, secondBin: 5 },
  output: { overlap: 3, firstResidual: 0, secondResidual: 2 },
} satisfies ToolExample<Input, Output>;
export const histogramOverlapBinResidualTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["similarity", "mathematics"],
      keywords: ["similarity", "mathematics"],
    },
    id: "similarity/histogram-overlap-bin-residual",
    title: "Histogram Overlap Bin Residual",
    description:
      "Partition two explicit nonnegative histogram bin masses into overlap and one-sided residuals without normalizing histograms.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstBin: { type: "number", minimum: 0 },
        secondBin: { type: "number", minimum: 0 },
      },
      required: ["firstBin", "secondBin"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        overlap: { type: "number" },
        firstResidual: { type: "number" },
        secondResidual: { type: "number" },
      },
      required: ["overlap", "firstResidual", "secondResidual"],
    },
    ports: {
      inputs: [
        {
          id: "firstBin",
          label: "First Bin",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondBin",
          label: "Second Bin",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "overlap", label: "Overlap", valueType: { type: "number" } },
        {
          id: "firstResidual",
          label: "First Residual",
          valueType: { type: "number" },
        },
        {
          id: "secondResidual",
          label: "Second Residual",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = histogramOverlapBinResidualTool.execute;
export default histogramOverlapBinResidualTool;
