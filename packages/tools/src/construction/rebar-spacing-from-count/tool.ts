import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RebarSpacingFromCountInput = Readonly<{
  readonly outerCenterSpanM: number;
  readonly barCount: number;
}>;
export type RebarSpacingFromCountOutput = Readonly<{
  readonly spacingM: number;
}>;

export const calculateRebarSpacingFromCount = (
  x: RebarSpacingFromCountInput,
): RebarSpacingFromCountOutput => {
  if (!Number.isFinite(x.outerCenterSpanM) || x.outerCenterSpanM < 0)
    simpleError("outerCenterSpanM", "Provide a finite number at least 0.");
  if (!Number.isSafeInteger(x.barCount) || x.barCount < 2)
    simpleError("barCount", "Provide a safe integer at least 2.");
  if (!(x.barCount >= 2))
    simpleError("barCount", "At least two bars are required.");
  const spacingM = x.outerCenterSpanM / (x.barCount - 1);
  if (!Number.isFinite(spacingM))
    simpleError("spacingM", "The inputs produce an invalid result.");
  return { spacingM: Object.is(spacingM, -0) ? 0 : spacingM };
};

export const example = {
  input: { outerCenterSpanM: 2, barCount: 5 },
  output: { spacingM: 0.5 },
} satisfies ToolExample<
  RebarSpacingFromCountInput,
  RebarSpacingFromCountOutput
>;

export const tool = createSimpleTool({
  id: "construction/rebar-spacing-from-count",
  title: "Rebar Spacing From Count",
  description:
    "Find equal center-to-center spacing for bars whose first and last centers span a known distance.",
  inputs: [
    {
      id: "outerCenterSpanM",
      kind: "number",
      label: "First-to-last center span",
      unit: "m",
      minimum: 0,
    },
    { id: "barCount", kind: "integer", label: "Bar count", minimum: 2 },
  ],
  outputs: [
    { id: "spacingM", kind: "number", label: "Center spacing", unit: "m" },
  ],
  calculate: (input) =>
    calculateRebarSpacingFromCount({
      outerCenterSpanM: input.outerCenterSpanM as number,
      barCount: input.barCount as number,
    }),
});
export const rebarSpacingFromCountTool = tool;
export const runRebarSpacingFromCount = tool.execute;
export default tool;
