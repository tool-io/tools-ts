import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SprossenTeilungGleichmassigInput = Readonly<{
  readonly insideWidthMm: number;
  readonly muntinCount: number;
  readonly muntinWidthMm: number;
}>;
export type SprossenTeilungGleichmassigOutput = Readonly<{
  readonly clearGapMm: number;
}>;

export const calculateSprossenTeilungGleichmassig = (
  x: SprossenTeilungGleichmassigInput,
): SprossenTeilungGleichmassigOutput => {
  if (!Number.isFinite(x.insideWidthMm) || x.insideWidthMm < 0)
    simpleError("insideWidthMm", "Provide a finite number at least 0.");
  if (
    !Number.isFinite(x.muntinCount) ||
    !Number.isSafeInteger(x.muntinCount) ||
    x.muntinCount < 0
  )
    simpleError("muntinCount", "Provide a safe integer at least 0.");
  if (!Number.isFinite(x.muntinWidthMm) || x.muntinWidthMm < 0)
    simpleError("muntinWidthMm", "Provide a finite number at least 0.");
  if (
    !Number.isSafeInteger(x.muntinCount) ||
    x.muntinCount * x.muntinWidthMm > x.insideWidthMm
  )
    simpleError("input", "Inputs violate the stated model or operating range.");
  const clearGapMm =
    (x.insideWidthMm - x.muntinCount * x.muntinWidthMm) / (x.muntinCount + 1);
  if (!Number.isFinite(clearGapMm))
    simpleError(
      "clearGapMm",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { clearGapMm: Object.is(clearGapMm, -0) ? 0 : clearGapMm };
};

export const example = {
  input: { insideWidthMm: 1000, muntinCount: 3, muntinWidthMm: 20 },
  output: { clearGapMm: 235 },
} satisfies ToolExample<
  SprossenTeilungGleichmassigInput,
  SprossenTeilungGleichmassigOutput
>;

export const tool = createSimpleTool({
  id: "carpentry/sprossen-teilung-gleichmassig",
  title: "Sprossen Teilung Gleichmassig",
  description:
    "Equal clear opening width between identical muntins across a frame, including both end gaps.",
  inputs: [
    {
      id: "insideWidthMm",
      kind: "number",
      label: "Inside Width Mm",
      unit: "mm",
      minimum: 0,
    },
    { id: "muntinCount", kind: "integer", label: "Muntin Count", minimum: 0 },
    {
      id: "muntinWidthMm",
      kind: "number",
      label: "Muntin Width Mm",
      unit: "mm",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "clearGapMm", kind: "number", label: "Clear Gap Mm", unit: "mm" },
  ],
  calculate: (input) =>
    calculateSprossenTeilungGleichmassig({
      insideWidthMm: input.insideWidthMm as number,
      muntinCount: input.muntinCount as number,
      muntinWidthMm: input.muntinWidthMm as number,
    }),
});
export const sprossenTeilungGleichmassigTool = tool;
export const runSprossenTeilungGleichmassig = tool.execute;
export default tool;
