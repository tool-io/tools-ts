import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RabbetDepthInput = Readonly<{
  readonly stockThicknessMm: number;
  readonly remainingWebMm: number;
}>;
export type RabbetDepthOutput = Readonly<{
  readonly rabbetDepthMm: number;
}>;

export const calculateRabbetDepth = (
  x: RabbetDepthInput,
): RabbetDepthOutput => {
  if (!Number.isFinite(x.stockThicknessMm) || x.stockThicknessMm < 0)
    simpleError("stockThicknessMm", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.remainingWebMm) || x.remainingWebMm < 0)
    simpleError("remainingWebMm", "Provide a finite number at least 0.");
  if (!(x.stockThicknessMm >= x.remainingWebMm))
    simpleError(
      "stockThicknessMm",
      "Remaining web cannot exceed stock thickness.",
    );
  const rabbetDepthMm = x.stockThicknessMm - x.remainingWebMm;
  if (!Number.isFinite(rabbetDepthMm))
    simpleError("rabbetDepthMm", "The inputs produce an invalid result.");
  return { rabbetDepthMm: Object.is(rabbetDepthMm, -0) ? 0 : rabbetDepthMm };
};

export const example = {
  input: { stockThicknessMm: 18, remainingWebMm: 9 },
  output: { rabbetDepthMm: 9 },
} satisfies ToolExample<RabbetDepthInput, RabbetDepthOutput>;

export const tool = createSimpleTool({
  id: "carpentry/rabbet-depth",
  title: "Rabbet Depth",
  description:
    "Find rabbet cut depth from stock thickness and the remaining material web specified by the maker.",
  inputs: [
    {
      id: "stockThicknessMm",
      kind: "number",
      label: "Stock thickness",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "remainingWebMm",
      kind: "number",
      label: "Remaining web thickness",
      unit: "mm",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "rabbetDepthMm", kind: "number", label: "Rabbet depth", unit: "mm" },
  ],
  calculate: (input) =>
    calculateRabbetDepth({
      stockThicknessMm: input.stockThicknessMm as number,
      remainingWebMm: input.remainingWebMm as number,
    }),
});
export const rabbetDepthTool = tool;
export const runRabbetDepth = tool.execute;
export default tool;
