import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DadoDepthInput = Readonly<{
  readonly stockThicknessMm: number;
  readonly depthFraction: number;
}>;
export type DadoDepthOutput = Readonly<{
  readonly dadoDepthMm: number;
}>;

export const calculateDadoDepth = (x: DadoDepthInput): DadoDepthOutput => {
  if (!Number.isFinite(x.stockThicknessMm) || x.stockThicknessMm < 0)
    simpleError("stockThicknessMm", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.depthFraction) || x.depthFraction < 0)
    simpleError("depthFraction", "Provide a finite number at least 0.");
  if (!(x.depthFraction <= 1))
    simpleError("depthFraction", "Depth fraction cannot exceed one.");
  const dadoDepthMm = x.stockThicknessMm * x.depthFraction;
  if (!Number.isFinite(dadoDepthMm))
    simpleError("dadoDepthMm", "The inputs produce an invalid result.");
  return { dadoDepthMm: Object.is(dadoDepthMm, -0) ? 0 : dadoDepthMm };
};

export const example = {
  input: { stockThicknessMm: 18, depthFraction: 0.33 },
  output: { dadoDepthMm: 5.94 },
} satisfies ToolExample<DadoDepthInput, DadoDepthOutput>;

export const tool = createSimpleTool({
  id: "carpentry/dado-depth",
  title: "Dado Depth",
  description:
    "Calculate target dado depth from board thickness and an explicitly chosen fraction of that thickness.",
  inputs: [
    {
      id: "stockThicknessMm",
      kind: "number",
      label: "Stock thickness",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "depthFraction",
      kind: "number",
      label: "Chosen thickness fraction",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "dadoDepthMm", kind: "number", label: "Dado depth", unit: "mm" },
  ],
  calculate: (input) =>
    calculateDadoDepth({
      stockThicknessMm: input.stockThicknessMm as number,
      depthFraction: input.depthFraction as number,
    }),
});
export const dadoDepthTool = tool;
export const runDadoDepth = tool.execute;
export default tool;
