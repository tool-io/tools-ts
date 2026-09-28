import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly reticulocytes: number;
  readonly eligibleRedCells: number;
  readonly excludedCells: number;
};
export type Output = {
  readonly reticulocyteFraction: number;
  readonly excludedShare: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reticulocytes: { type: "integer", minimum: 0 },
    eligibleRedCells: { type: "integer", minimum: 1 },
    excludedCells: { type: "integer", minimum: 0 },
  },
  required: ["reticulocytes", "eligibleRedCells", "excludedCells"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reticulocyteFraction: { type: "number" },
    excludedShare: { type: "number" },
  },
  required: ["reticulocyteFraction", "excludedShare"],
} as const;
/** Observed research count fractions only; no hematocrit correction or maturation-time index is supplied. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { reticulocytes, eligibleRedCells, excludedCells } = request;
  const compute = (): Output => {
    H.integer(eligibleRedCells, 1);
    H.integer(reticulocytes, 0, eligibleRedCells);
    H.integer(excludedCells, 0);
    return {
      reticulocyteFraction: reticulocytes / eligibleRedCells,
      excludedShare: excludedCells / (eligibleRedCells + excludedCells),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { reticulocytes: 20, eligibleRedCells: 1000, excludedCells: 50 },
  output: { reticulocyteFraction: 0.02, excludedShare: 0.047619047619047616 },
} satisfies ToolExample<Input, Output>;
export const reticulocyteResearchCountDenominatorTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "hematology/reticulocyte-research-count-denominator-term",
      title: "Reticulocyte Research Count Denominator Term Tool",
      description:
        "Observed research count fractions only; no hematocrit correction or maturation-time index is supplied.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          reticulocytes: { type: "integer", minimum: 0 },
          eligibleRedCells: { type: "integer", minimum: 1 },
          excludedCells: { type: "integer", minimum: 0 },
        },
        required: ["reticulocytes", "eligibleRedCells", "excludedCells"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          reticulocyteFraction: { type: "number" },
          excludedShare: { type: "number" },
        },
        required: ["reticulocyteFraction", "excludedShare"],
      },
      ports: {
        inputs: [
          {
            id: "reticulocytes",
            label: "Reticulocytes",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "eligibleRedCells",
            label: "Eligible Red Cells",
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
            id: "reticulocyteFraction",
            label: "Reticulocyte Fraction",
            valueType: { type: "number" },
          },
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
export const run = reticulocyteResearchCountDenominatorTermTool.execute;
export default reticulocyteResearchCountDenominatorTermTool;
