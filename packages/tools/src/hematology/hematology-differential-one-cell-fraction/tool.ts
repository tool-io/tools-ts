import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly categoryCells: number;
  readonly classifiedCells: number;
  readonly unclassifiedCells: number;
  readonly includeUnclassified: boolean;
};
export type Output = {
  readonly denominator: number;
  readonly categoryFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    categoryCells: { type: "integer", minimum: 0 },
    classifiedCells: { type: "integer", minimum: 1 },
    unclassifiedCells: { type: "integer", minimum: 0 },
    includeUnclassified: { type: "boolean" },
  },
  required: [
    "categoryCells",
    "classifiedCells",
    "unclassifiedCells",
    "includeUnclassified",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    denominator: { type: "integer" },
    categoryFraction: { type: "number" },
  },
  required: ["denominator", "categoryFraction"],
} as const;
/** Calculate hematology differential one cell fraction from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    categoryCells,
    classifiedCells,
    unclassifiedCells,
    includeUnclassified,
  } = request;
  const compute = (): Output => {
    H.integer(classifiedCells, 1);
    H.integer(categoryCells, 0, classifiedCells);
    H.integer(unclassifiedCells, 0);
    return {
      denominator:
        classifiedCells + (includeUnclassified ? unclassifiedCells : 0),
      categoryFraction:
        categoryCells /
        (classifiedCells + (includeUnclassified ? unclassifiedCells : 0)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    categoryCells: 20,
    classifiedCells: 100,
    unclassifiedCells: 25,
    includeUnclassified: true,
  },
  output: { denominator: 125, categoryFraction: 0.16 },
} satisfies ToolExample<Input, Output>;
export const hematologyDifferentialOneCellFractionTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "hematology/hematology-differential-one-cell-fraction",
      title: "Hematology Differential One Cell Fraction Tool",
      description:
        "Calculate hematology differential one cell fraction from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          categoryCells: { type: "integer", minimum: 0 },
          classifiedCells: { type: "integer", minimum: 1 },
          unclassifiedCells: { type: "integer", minimum: 0 },
          includeUnclassified: { type: "boolean" },
        },
        required: [
          "categoryCells",
          "classifiedCells",
          "unclassifiedCells",
          "includeUnclassified",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          denominator: { type: "integer" },
          categoryFraction: { type: "number" },
        },
        required: ["denominator", "categoryFraction"],
      },
      ports: {
        inputs: [
          {
            id: "categoryCells",
            label: "Category Cells",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "classifiedCells",
            label: "Classified Cells",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "unclassifiedCells",
            label: "Unclassified Cells",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "includeUnclassified",
            label: "Include Unclassified",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          {
            id: "denominator",
            label: "Denominator",
            valueType: { type: "integer" },
          },
          {
            id: "categoryFraction",
            label: "Category Fraction",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = hematologyDifferentialOneCellFractionTool.execute;
export default hematologyDifferentialOneCellFractionTool;
