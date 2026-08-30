import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LumberDefectPercentageInput = Readonly<{
  readonly defectMillimeters: number;
  readonly boardMillimeters: number;
}>;
export type LumberDefectPercentageOutput = Readonly<{
  readonly defectPercent: number;
}>;

export const calculateLumberDefectPercentage = (
  x: LumberDefectPercentageInput,
): LumberDefectPercentageOutput => {
  if (!Number.isFinite(x.defectMillimeters) || x.defectMillimeters < 0)
    simpleError("defectMillimeters", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.boardMillimeters) || x.boardMillimeters < 0)
    simpleError("boardMillimeters", "Provide a finite number at least 0.");
  if (x.defectMillimeters > x.boardMillimeters)
    simpleError("input", "Inputs violate the stated model or operating range.");
  const defectPercent = (100 * x.defectMillimeters) / x.boardMillimeters;
  if (!Number.isFinite(defectPercent))
    simpleError(
      "defectPercent",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { defectPercent: Object.is(defectPercent, -0) ? 0 : defectPercent };
};

export const example = {
  input: { defectMillimeters: 100, boardMillimeters: 1000 },
  output: { defectPercent: 10 },
} satisfies ToolExample<
  LumberDefectPercentageInput,
  LumberDefectPercentageOutput
>;

export const tool = createSimpleTool({
  id: "construction/lumber-defect-percentage",
  title: "Lumber Defect Percentage",
  description:
    "Rejected portion of a lumber length from total measured defect length divided by the original board length.",
  inputs: [
    {
      id: "defectMillimeters",
      kind: "number",
      label: "Defect Millimeters",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "boardMillimeters",
      kind: "number",
      label: "Board Millimeters",
      unit: "mm",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "defectPercent", kind: "number", label: "Defect Percent", unit: "%" },
  ],
  calculate: (input) =>
    calculateLumberDefectPercentage({
      defectMillimeters: input.defectMillimeters as number,
      boardMillimeters: input.boardMillimeters as number,
    }),
});
export const lumberDefectPercentageTool = tool;
export const runLumberDefectPercentage = tool.execute;
export default tool;
