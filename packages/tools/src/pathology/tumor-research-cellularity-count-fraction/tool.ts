import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly designatedCells: number;
  readonly otherCells: number;
  readonly excludedCells: number;
};
export type Output = {
  readonly eligibleCells: number;
  readonly fraction: number;
  readonly excludedShare: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    designatedCells: { type: "integer", minimum: 0 },
    otherCells: { type: "integer", minimum: 0 },
    excludedCells: { type: "integer", minimum: 0 },
  },
  required: ["designatedCells", "otherCells", "excludedCells"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eligibleCells: { type: "integer" },
    fraction: { type: "number" },
    excludedShare: { type: "number" },
  },
  required: ["eligibleCells", "fraction", "excludedShare"],
} as const;
/** Descriptive fraction from caller-classified research counts; no cell identification, pathology grade or treatment implication. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { designatedCells, otherCells, excludedCells } = request;
  const compute = (): Output => {
    H.integer(designatedCells, 0);
    H.integer(otherCells, 0);
    H.integer(excludedCells, 0);
    H.domain(designatedCells + otherCells > 0);
    return {
      eligibleCells: designatedCells + otherCells,
      fraction: designatedCells / (designatedCells + otherCells),
      excludedShare:
        excludedCells / (designatedCells + otherCells + excludedCells),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { designatedCells: 40, otherCells: 60, excludedCells: 25 },
  output: { eligibleCells: 100, fraction: 0.4, excludedShare: 0.2 },
} satisfies ToolExample<Input, Output>;
export const tumorResearchCellularityCountFractionTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "pathology/tumor-research-cellularity-count-fraction",
      title: "Tumor Research Cellularity Count Fraction Tool",
      description:
        "Descriptive fraction from caller-classified research counts; no cell identification, pathology grade or treatment implication.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          designatedCells: { type: "integer", minimum: 0 },
          otherCells: { type: "integer", minimum: 0 },
          excludedCells: { type: "integer", minimum: 0 },
        },
        required: ["designatedCells", "otherCells", "excludedCells"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          eligibleCells: { type: "integer" },
          fraction: { type: "number" },
          excludedShare: { type: "number" },
        },
        required: ["eligibleCells", "fraction", "excludedShare"],
      },
      ports: {
        inputs: [
          {
            id: "designatedCells",
            label: "Designated Cells",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "otherCells",
            label: "Other Cells",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "excludedCells",
            label: "Excluded Cells",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "eligibleCells",
            label: "Eligible Cells",
            valueType: { type: "integer" },
          },
          { id: "fraction", label: "Fraction", valueType: { type: "number" } },
          {
            id: "excludedShare",
            label: "Excluded Share",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = tumorResearchCellularityCountFractionTool.execute;
export default tumorResearchCellularityCountFractionTool;
