import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly parentCellsPerVolume: number;
  readonly childFraction: number;
  readonly grandchildFraction: number;
};
export type Output = {
  readonly childCount: number;
  readonly grandchildCount: number;
  readonly grandchildOfParent: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    parentCellsPerVolume: { type: "number", minimum: 0 },
    childFraction: { type: "number", minimum: 0, maximum: 1 },
    grandchildFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["parentCellsPerVolume", "childFraction", "grandchildFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    childCount: { type: "number" },
    grandchildCount: { type: "number" },
    grandchildOfParent: { type: "number" },
  },
  required: ["childCount", "grandchildCount", "grandchildOfParent"],
} as const;
/** Calculate immune cell absolute relative count factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { parentCellsPerVolume, childFraction, grandchildFraction } = request;
  const compute = (): Output => {
    H.domain(parentCellsPerVolume >= 0);
    H.probability(childFraction);
    H.probability(grandchildFraction);
    return {
      childCount: parentCellsPerVolume * childFraction,
      grandchildCount:
        parentCellsPerVolume * childFraction * grandchildFraction,
      grandchildOfParent: childFraction * grandchildFraction,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    parentCellsPerVolume: 1000,
    childFraction: 0.2,
    grandchildFraction: 0.25,
  },
  output: { childCount: 200, grandchildCount: 50, grandchildOfParent: 0.05 },
} satisfies ToolExample<Input, Output>;
export const immuneCellAbsoluteRelativeCountFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "immunology/immune-cell-absolute-relative-count-factor",
      title: "Immune Cell Absolute Relative Count Factor Tool",
      description:
        "Calculate immune cell absolute relative count factor from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          parentCellsPerVolume: { type: "number", minimum: 0 },
          childFraction: { type: "number", minimum: 0, maximum: 1 },
          grandchildFraction: { type: "number", minimum: 0, maximum: 1 },
        },
        required: [
          "parentCellsPerVolume",
          "childFraction",
          "grandchildFraction",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          childCount: { type: "number" },
          grandchildCount: { type: "number" },
          grandchildOfParent: { type: "number" },
        },
        required: ["childCount", "grandchildCount", "grandchildOfParent"],
      },
      ports: {
        inputs: [
          {
            id: "parentCellsPerVolume",
            label: "Parent Cells Per Volume",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "childFraction",
            label: "Child Fraction",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "grandchildFraction",
            label: "Grandchild Fraction",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "childCount",
            label: "Child Count",
            valueType: { type: "number" },
          },
          {
            id: "grandchildCount",
            label: "Grandchild Count",
            valueType: { type: "number" },
          },
          {
            id: "grandchildOfParent",
            label: "Grandchild Of Parent",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = immuneCellAbsoluteRelativeCountFactorTool.execute;
export default immuneCellAbsoluteRelativeCountFactorTool;
