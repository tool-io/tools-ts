import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CarpetSeamLengthInput = Readonly<{
  readonly seamLengthsM: readonly number[];
}>;
export type CarpetSeamLengthOutput = Readonly<{
  readonly totalSeamLengthM: number;
}>;

export const calculateCarpetSeamLength = (
  x: CarpetSeamLengthInput,
): CarpetSeamLengthOutput => {
  if (
    !Array.isArray(x.seamLengthsM) ||
    !x.seamLengthsM.every((v) => typeof v === "number" && Number.isFinite(v))
  )
    simpleError("seamLengthsM", "Provide a finite number list.");
  if (!x.seamLengthsM.every((v) => v >= 0))
    simpleError("seamLengthsM", "Seam lengths cannot be negative.");
  const totalSeamLengthM = x.seamLengthsM.reduce((a, b) => a + b, 0);
  if (!Number.isFinite(totalSeamLengthM))
    simpleError("totalSeamLengthM", "The inputs produce an invalid result.");
  return {
    totalSeamLengthM: Object.is(totalSeamLengthM, -0) ? 0 : totalSeamLengthM,
  };
};

export const example = {
  input: { seamLengthsM: [2, 3] },
  output: { totalSeamLengthM: 5 },
} satisfies ToolExample<CarpetSeamLengthInput, CarpetSeamLengthOutput>;

export const tool = createSimpleTool({
  id: "construction/carpet-seam-length",
  title: "Carpet Seam Length",
  description:
    "Sum measured lengths of carpet seams; count only joins, not room perimeter or wall edges.",
  inputs: [
    {
      id: "seamLengthsM",
      kind: "numberList",
      label: "Seam lengths",
      unit: "m",
    },
  ],
  outputs: [
    {
      id: "totalSeamLengthM",
      kind: "number",
      label: "Total seam length",
      unit: "m",
    },
  ],
  calculate: (input) =>
    calculateCarpetSeamLength({
      seamLengthsM: input.seamLengthsM as readonly number[],
    }),
});
export const carpetSeamLengthTool = tool;
export const runCarpetSeamLength = tool.execute;
export default tool;
