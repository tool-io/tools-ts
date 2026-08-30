import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MortiseWidthInput = Readonly<{
  readonly tenonThicknessMm: number;
  readonly fitClearanceMm: number;
}>;
export type MortiseWidthOutput = Readonly<{
  readonly mortiseWidthMm: number;
}>;

export const calculateMortiseWidth = (
  x: MortiseWidthInput,
): MortiseWidthOutput => {
  if (!Number.isFinite(x.tenonThicknessMm) || x.tenonThicknessMm < 0)
    simpleError("tenonThicknessMm", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.fitClearanceMm) || x.fitClearanceMm < 0)
    simpleError("fitClearanceMm", "Provide a finite number at least 0.");
  const mortiseWidthMm = x.tenonThicknessMm + x.fitClearanceMm;
  if (!Number.isFinite(mortiseWidthMm))
    simpleError("mortiseWidthMm", "The inputs produce an invalid result.");
  return { mortiseWidthMm: Object.is(mortiseWidthMm, -0) ? 0 : mortiseWidthMm };
};

export const example = {
  input: { tenonThicknessMm: 10, fitClearanceMm: 0.2 },
  output: { mortiseWidthMm: 10.2 },
} satisfies ToolExample<MortiseWidthInput, MortiseWidthOutput>;

export const tool = createSimpleTool({
  id: "carpentry/mortise-width",
  title: "Mortise Width",
  description:
    "Size mortise width to receive a measured tenon thickness plus chosen side-to-side fit clearance.",
  inputs: [
    {
      id: "tenonThicknessMm",
      kind: "number",
      label: "Tenon thickness",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "fitClearanceMm",
      kind: "number",
      label: "Total fit clearance",
      unit: "mm",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "mortiseWidthMm",
      kind: "number",
      label: "Mortise width",
      unit: "mm",
    },
  ],
  calculate: (input) =>
    calculateMortiseWidth({
      tenonThicknessMm: input.tenonThicknessMm as number,
      fitClearanceMm: input.fitClearanceMm as number,
    }),
});
export const mortiseWidthTool = tool;
export const runMortiseWidth = tool.execute;
export default tool;
