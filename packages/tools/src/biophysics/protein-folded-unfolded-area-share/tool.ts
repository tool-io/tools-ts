import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly foldedPeakArea: number;
  readonly totalAssignedPeakArea: number;
};
export type Output = { readonly fraction: number; readonly remainder: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    foldedPeakArea: { type: "number", minimum: 0 },
    totalAssignedPeakArea: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["foldedPeakArea", "totalAssignedPeakArea"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { fraction: { type: "number" }, remainder: { type: "number" } },
  required: ["fraction", "remainder"],
} as const;
/** Calculate the supplied folded-state peak-area fraction and remaining assigned area without correcting response factors. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { foldedPeakArea, totalAssignedPeakArea } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isFinite(totalAssignedPeakArea) && totalAssignedPeakArea > 0,
      "totalAssignedPeakArea",
    ),
      totalAssignedPeakArea);
    H.domain(
      foldedPeakArea >= 0 && foldedPeakArea <= totalAssignedPeakArea,
      "foldedPeakArea",
    );
    return {
      fraction: foldedPeakArea / totalAssignedPeakArea,
      remainder: totalAssignedPeakArea - foldedPeakArea,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { foldedPeakArea: 30, totalAssignedPeakArea: 120 },
  output: { fraction: 0.25, remainder: 90 },
} satisfies ToolExample<Input, Output>;
export const proteinFoldedUnfoldedAreaShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["biophysics", "physics"],
      keywords: ["biophysics", "physics"],
    },
    id: "biophysics/protein-folded-unfolded-area-share",
    title: "Protein Folded Unfolded Area Share",
    description:
      "Calculate the supplied folded-state peak-area fraction and remaining assigned area without correcting response factors.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        foldedPeakArea: { type: "number", minimum: 0 },
        totalAssignedPeakArea: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["foldedPeakArea", "totalAssignedPeakArea"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fraction: { type: "number" },
        remainder: { type: "number" },
      },
      required: ["fraction", "remainder"],
    },
    ports: {
      inputs: [
        {
          id: "foldedPeakArea",
          label: "Folded Peak Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "totalAssignedPeakArea",
          label: "Total Assigned Peak Area",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "fraction", label: "Fraction", valueType: { type: "number" } },
        { id: "remainder", label: "Remainder", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = proteinFoldedUnfoldedAreaShareTool.execute;
export default proteinFoldedUnfoldedAreaShareTool;
