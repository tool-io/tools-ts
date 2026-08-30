import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TrellisLathSpacingInput = Readonly<{
  readonly insideSpanMillimeters: number;
  readonly lathWidthMillimeters: number;
  readonly lathCount: number;
}>;
export type TrellisLathSpacingOutput = Readonly<{
  readonly clearGapMillimeters: number;
}>;

export const calculateTrellisLathSpacing = (
  x: TrellisLathSpacingInput,
): TrellisLathSpacingOutput => {
  if (!Number.isFinite(x.insideSpanMillimeters) || x.insideSpanMillimeters < 0)
    simpleError("insideSpanMillimeters", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.lathWidthMillimeters) || x.lathWidthMillimeters < 0)
    simpleError("lathWidthMillimeters", "Provide a finite number at least 0.");
  if (
    !Number.isFinite(x.lathCount) ||
    !Number.isSafeInteger(x.lathCount) ||
    x.lathCount < 0
  )
    simpleError("lathCount", "Provide a safe integer at least 0.");
  if (
    !Number.isSafeInteger(x.lathCount) ||
    x.lathCount < 1 ||
    x.lathWidthMillimeters * x.lathCount > x.insideSpanMillimeters
  )
    simpleError("input", "Inputs violate the stated model or operating range.");
  const clearGapMillimeters =
    (x.insideSpanMillimeters - x.lathWidthMillimeters * x.lathCount) /
    (x.lathCount + 1);
  if (!Number.isFinite(clearGapMillimeters))
    simpleError(
      "clearGapMillimeters",
      "Inputs produce an undefined or non-finite result.",
    );
  return {
    clearGapMillimeters: Object.is(clearGapMillimeters, -0)
      ? 0
      : clearGapMillimeters,
  };
};

export const example = {
  input: {
    insideSpanMillimeters: 1000,
    lathWidthMillimeters: 50,
    lathCount: 5,
  },
  output: { clearGapMillimeters: 125 },
} satisfies ToolExample<TrellisLathSpacingInput, TrellisLathSpacingOutput>;

export const tool = createSimpleTool({
  id: "carpentry/trellis-lath-spacing",
  title: "Trellis Lath Spacing",
  description:
    "Equal clear gap including both end gaps when equal-width trellis laths fill a known inside span.",
  inputs: [
    {
      id: "insideSpanMillimeters",
      kind: "number",
      label: "Inside Span Millimeters",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "lathWidthMillimeters",
      kind: "number",
      label: "Lath Width Millimeters",
      unit: "mm",
      minimum: 0,
    },
    { id: "lathCount", kind: "integer", label: "Lath Count", minimum: 0 },
  ],
  outputs: [
    {
      id: "clearGapMillimeters",
      kind: "number",
      label: "Clear Gap Millimeters",
      unit: "mm",
    },
  ],
  calculate: (input) =>
    calculateTrellisLathSpacing({
      insideSpanMillimeters: input.insideSpanMillimeters as number,
      lathWidthMillimeters: input.lathWidthMillimeters as number,
      lathCount: input.lathCount as number,
    }),
});
export const trellisLathSpacingTool = tool;
export const runTrellisLathSpacing = tool.execute;
export default tool;
