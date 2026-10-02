import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly overlapArea: number; readonly cellArea: number };
export type Output = { readonly fraction: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    overlapArea: { type: "number", minimum: 0 },
    cellArea: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["overlapArea", "cellArea"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { fraction: { type: "number" } },
  required: ["fraction"],
} as const;
/** Calculate grid zone overlap fraction from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { overlapArea, cellArea } = request;
  const compute = (): Output => {
    H.positive(cellArea);
    H.domain(overlapArea >= 0 && overlapArea <= cellArea);
    return { fraction: overlapArea / cellArea };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { overlapArea: 3, cellArea: 12 },
  output: { fraction: 0.25 },
} satisfies ToolExample<Input, Output>;
export const gridZoneOverlapFractionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "precision-agriculture/grid-zone-overlap-fraction",
    title: "Grid Zone Overlap Fraction Tool",
    description:
      "Calculate grid zone overlap fraction from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        overlapArea: { type: "number", minimum: 0 },
        cellArea: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["overlapArea", "cellArea"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { fraction: { type: "number" } },
      required: ["fraction"],
    },
    ports: {
      inputs: [
        {
          id: "overlapArea",
          label: "Overlap Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "cellArea",
          label: "Cell Area",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "fraction", label: "Fraction", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = gridZoneOverlapFractionTool.execute;
export default gridZoneOverlapFractionTool;
