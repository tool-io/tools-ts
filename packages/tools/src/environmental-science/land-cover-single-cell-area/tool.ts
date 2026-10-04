import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly cellWidthMeters: number;
  readonly cellHeightMeters: number;
  readonly coveredFraction: number;
};
export type Output = { readonly coveredAreaSquareMeters: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cellWidthMeters: { type: "number", exclusiveMinimum: 0 },
    cellHeightMeters: { type: "number", exclusiveMinimum: 0 },
    coveredFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["cellWidthMeters", "cellHeightMeters", "coveredFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { coveredAreaSquareMeters: { type: "number" } },
  required: ["coveredAreaSquareMeters"],
} as const;
/** Compute planar covered area for one rectangular map cell and its explicitly supplied fractional cover. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { cellWidthMeters, cellHeightMeters, coveredFraction } = request;
  const compute = (): Output => {
    (H.domain(cellWidthMeters > 0, "cellWidthMeters"), cellWidthMeters);
    (H.domain(cellHeightMeters > 0, "cellHeightMeters"), cellHeightMeters);
    (H.domain(coveredFraction >= 0 && coveredFraction <= 1, "coveredFraction"),
      coveredFraction);
    return {
      coveredAreaSquareMeters:
        cellWidthMeters * cellHeightMeters * coveredFraction,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { cellWidthMeters: 30, cellHeightMeters: 30, coveredFraction: 0.25 },
  output: { coveredAreaSquareMeters: 225 },
} satisfies ToolExample<Input, Output>;
export const landCoverSingleCellAreaTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "environmental-science/land-cover-single-cell-area",
    title: "Land Cover Single Cell Area Tool",
    description:
      "Compute planar covered area for one rectangular map cell and its explicitly supplied fractional cover.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        cellWidthMeters: { type: "number", exclusiveMinimum: 0 },
        cellHeightMeters: { type: "number", exclusiveMinimum: 0 },
        coveredFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["cellWidthMeters", "cellHeightMeters", "coveredFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { coveredAreaSquareMeters: { type: "number" } },
      required: ["coveredAreaSquareMeters"],
    },
    ports: {
      inputs: [
        {
          id: "cellWidthMeters",
          label: "Cell Width Meters",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "cellHeightMeters",
          label: "Cell Height Meters",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "coveredFraction",
          label: "Covered Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "coveredAreaSquareMeters",
          label: "Covered Area Square Meters",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = landCoverSingleCellAreaTool.execute;
export default landCoverSingleCellAreaTool;
