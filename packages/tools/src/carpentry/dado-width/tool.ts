import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DadoWidthInput = Readonly<{
  readonly panelThicknessMm: number;
  readonly fitClearanceMm: number;
}>;
export type DadoWidthOutput = Readonly<{
  readonly dadoWidthMm: number;
}>;

export const calculateDadoWidth = (x: DadoWidthInput): DadoWidthOutput => {
  if (!Number.isFinite(x.panelThicknessMm) || x.panelThicknessMm < 0)
    simpleError("panelThicknessMm", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.fitClearanceMm) || x.fitClearanceMm < 0)
    simpleError("fitClearanceMm", "Provide a finite number at least 0.");
  const dadoWidthMm = x.panelThicknessMm + x.fitClearanceMm;
  if (!Number.isFinite(dadoWidthMm))
    simpleError("dadoWidthMm", "The inputs produce an invalid result.");
  return { dadoWidthMm: Object.is(dadoWidthMm, -0) ? 0 : dadoWidthMm };
};

export const example = {
  input: { panelThicknessMm: 18, fitClearanceMm: 0.2 },
  output: { dadoWidthMm: 18.2 },
} satisfies ToolExample<DadoWidthInput, DadoWidthOutput>;

export const tool = createSimpleTool({
  id: "carpentry/dado-width",
  title: "Dado Width",
  description:
    "Allow a dado to fit a measured panel thickness with explicit total width clearance.",
  inputs: [
    {
      id: "panelThicknessMm",
      kind: "number",
      label: "Panel thickness",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "fitClearanceMm",
      kind: "number",
      label: "Total clearance",
      unit: "mm",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "dadoWidthMm", kind: "number", label: "Cut width", unit: "mm" },
  ],
  calculate: (input) =>
    calculateDadoWidth({
      panelThicknessMm: input.panelThicknessMm as number,
      fitClearanceMm: input.fitClearanceMm as number,
    }),
});
export const dadoWidthTool = tool;
export const runDadoWidth = tool.execute;
export default tool;
