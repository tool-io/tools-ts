import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type GateDiagonalBraceLengthInput = Readonly<{
  readonly insideWidthMm: number;
  readonly insideHeightMm: number;
}>;
export type GateDiagonalBraceLengthOutput = Readonly<{
  readonly diagonalLengthMm: number;
}>;

export const calculateGateDiagonalBraceLength = (
  x: GateDiagonalBraceLengthInput,
): GateDiagonalBraceLengthOutput => {
  if (!Number.isFinite(x.insideWidthMm) || x.insideWidthMm < 0)
    simpleError("insideWidthMm", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.insideHeightMm) || x.insideHeightMm < 0)
    simpleError("insideHeightMm", "Provide a finite number at least 0.");
  const diagonalLengthMm = Math.hypot(x.insideWidthMm, x.insideHeightMm);
  if (!Number.isFinite(diagonalLengthMm))
    simpleError("diagonalLengthMm", "The inputs produce an invalid result.");
  return {
    diagonalLengthMm: Object.is(diagonalLengthMm, -0) ? 0 : diagonalLengthMm,
  };
};

export const example = {
  input: { insideWidthMm: 900, insideHeightMm: 1200 },
  output: { diagonalLengthMm: 1500 },
} satisfies ToolExample<
  GateDiagonalBraceLengthInput,
  GateDiagonalBraceLengthOutput
>;

export const tool = createSimpleTool({
  id: "carpentry/gate-diagonal-brace-length",
  title: "Gate Diagonal Brace Length",
  description:
    "Find the straight corner-to-corner brace length of a rectangular gate frame; excludes joinery and end cuts.",
  inputs: [
    {
      id: "insideWidthMm",
      kind: "number",
      label: "Inside frame width",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "insideHeightMm",
      kind: "number",
      label: "Inside frame height",
      unit: "mm",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "diagonalLengthMm",
      kind: "number",
      label: "Theoretical brace length",
      unit: "mm",
    },
  ],
  calculate: (input) =>
    calculateGateDiagonalBraceLength({
      insideWidthMm: input.insideWidthMm as number,
      insideHeightMm: input.insideHeightMm as number,
    }),
});
export const gateDiagonalBraceLengthTool = tool;
export const runGateDiagonalBraceLength = tool.execute;
export default tool;
