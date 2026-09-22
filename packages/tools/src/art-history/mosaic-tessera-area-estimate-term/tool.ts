import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly surfaceArea: number;
  readonly tesseraWidth: number;
  readonly groutGap: number;
  readonly wasteFraction: number;
};
export type Output = {
  readonly baseCount: number;
  readonly plannedCount: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    surfaceArea: { type: "number", minimum: 0 },
    tesseraWidth: { type: "number", exclusiveMinimum: 0 },
    groutGap: { type: "number", minimum: 0 },
    wasteFraction: { type: "number", minimum: 0 },
  },
  required: ["surfaceArea", "tesseraWidth", "groutGap", "wasteFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    baseCount: { type: "integer" },
    plannedCount: { type: "integer" },
  },
  required: ["baseCount", "plannedCount"],
} as const;
/** Square repeat-cell estimate including grout; boundary fitting is excluded. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { surfaceArea, tesseraWidth, groutGap, wasteFraction } = request;
  const compute = (): Output => {
    H.domain(surfaceArea >= 0 && groutGap >= 0 && wasteFraction >= 0);
    H.positive(tesseraWidth);
    return {
      baseCount: Math.ceil(surfaceArea / (tesseraWidth + groutGap) ** 2),
      plannedCount: Math.ceil(
        Math.ceil(surfaceArea / (tesseraWidth + groutGap) ** 2) *
          (1 + wasteFraction),
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { surfaceArea: 100, tesseraWidth: 1, groutGap: 1, wasteFraction: 0.1 },
  output: { baseCount: 25, plannedCount: 28 },
} satisfies ToolExample<Input, Output>;
export const mosaicTesseraAreaEstimateTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "art-history/mosaic-tessera-area-estimate-term",
    title: "Mosaic Tessera Area Estimate Term Tool",
    description:
      "Square repeat-cell estimate including grout; boundary fitting is excluded.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        surfaceArea: { type: "number", minimum: 0 },
        tesseraWidth: { type: "number", exclusiveMinimum: 0 },
        groutGap: { type: "number", minimum: 0 },
        wasteFraction: { type: "number", minimum: 0 },
      },
      required: ["surfaceArea", "tesseraWidth", "groutGap", "wasteFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        baseCount: { type: "integer" },
        plannedCount: { type: "integer" },
      },
      required: ["baseCount", "plannedCount"],
    },
    ports: {
      inputs: [
        {
          id: "surfaceArea",
          label: "Surface Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "tesseraWidth",
          label: "Tessera Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "groutGap",
          label: "Grout Gap",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "wasteFraction",
          label: "Waste Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "baseCount",
          label: "Base Count",
          valueType: { type: "integer" },
        },
        {
          id: "plannedCount",
          label: "Planned Count",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = mosaicTesseraAreaEstimateTermTool.execute;
export default mosaicTesseraAreaEstimateTermTool;
