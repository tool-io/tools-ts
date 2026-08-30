import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type GutterSlopeFallInput = Readonly<{
  readonly runM: number;
  readonly slopeMmPerM: number;
}>;
export type GutterSlopeFallOutput = Readonly<{
  readonly fallMm: number;
}>;

export const calculateGutterSlopeFall = (
  x: GutterSlopeFallInput,
): GutterSlopeFallOutput => {
  if (!Number.isFinite(x.runM) || x.runM < 0)
    simpleError("runM", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.slopeMmPerM) || x.slopeMmPerM < 0)
    simpleError("slopeMmPerM", "Provide a finite number at least 0.");
  const fallMm = x.runM * x.slopeMmPerM;
  if (!Number.isFinite(fallMm))
    simpleError("fallMm", "The inputs produce an invalid result.");
  return { fallMm: Object.is(fallMm, -0) ? 0 : fallMm };
};

export const example = {
  input: { runM: 12, slopeMmPerM: 3 },
  output: { fallMm: 36 },
} satisfies ToolExample<GutterSlopeFallInput, GutterSlopeFallOutput>;

export const tool = createSimpleTool({
  id: "construction/gutter-slope-fall",
  title: "Gutter Slope Fall",
  description:
    "Calculate elevation drop along a gutter from horizontal length and design slope per meter.",
  inputs: [
    { id: "runM", kind: "number", label: "Gutter run", unit: "m", minimum: 0 },
    {
      id: "slopeMmPerM",
      kind: "number",
      label: "Slope",
      unit: "mm/m",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "fallMm", kind: "number", label: "Elevation drop", unit: "mm" },
  ],
  calculate: (input) =>
    calculateGutterSlopeFall({
      runM: input.runM as number,
      slopeMmPerM: input.slopeMmPerM as number,
    }),
});
export const gutterSlopeFallTool = tool;
export const runGutterSlopeFall = tool.execute;
export default tool;
