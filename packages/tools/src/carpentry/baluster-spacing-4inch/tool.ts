import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BalusterSpacing4inchInput = Readonly<{
  readonly clearOpeningMm: number;
  readonly balusterWidthMm: number;
}>;
export type BalusterSpacing4inchOutput = Readonly<{
  readonly balusterCount: number;
  readonly actualClearGapMm: number;
}>;

export const calculateBalusterSpacing4inch = (
  x: BalusterSpacing4inchInput,
): BalusterSpacing4inchOutput => {
  if (!Number.isFinite(x.clearOpeningMm) || x.clearOpeningMm < 0)
    simpleError("clearOpeningMm", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.balusterWidthMm) || x.balusterWidthMm < 0)
    simpleError("balusterWidthMm", "Provide a finite number at least 0.");
  if (!(x.balusterWidthMm > 0))
    simpleError("balusterWidthMm", "Baluster width must be positive.");
  const balusterCount = Math.max(
    0,
    Math.ceil((x.clearOpeningMm - 101.6) / (x.balusterWidthMm + 101.6)),
  );
  if (!Number.isFinite(balusterCount) || !Number.isSafeInteger(balusterCount))
    simpleError("balusterCount", "The inputs produce an invalid result.");
  const actualClearGapMm =
    (x.clearOpeningMm -
      Math.max(
        0,
        Math.ceil((x.clearOpeningMm - 101.6) / (x.balusterWidthMm + 101.6)),
      ) *
        x.balusterWidthMm) /
    (Math.max(
      0,
      Math.ceil((x.clearOpeningMm - 101.6) / (x.balusterWidthMm + 101.6)),
    ) +
      1);
  if (!Number.isFinite(actualClearGapMm))
    simpleError("actualClearGapMm", "The inputs produce an invalid result.");
  return {
    balusterCount: Object.is(balusterCount, -0) ? 0 : balusterCount,
    actualClearGapMm: Object.is(actualClearGapMm, -0) ? 0 : actualClearGapMm,
  };
};

export const example = {
  input: { clearOpeningMm: 1000, balusterWidthMm: 40 },
  output: { balusterCount: 7, actualClearGapMm: 90 },
} satisfies ToolExample<BalusterSpacing4inchInput, BalusterSpacing4inchOutput>;

export const tool = createSimpleTool({
  id: "carpentry/baluster-spacing-4inch",
  title: "4-Inch Baluster Spacing",
  description:
    "Count equal-width balusters and calculate equal clear gaps, including both end gaps, so none exceeds a four-inch maximum.",
  inputs: [
    {
      id: "clearOpeningMm",
      kind: "number",
      label: "Opening between posts",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "balusterWidthMm",
      kind: "number",
      label: "Baluster width",
      unit: "mm",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "balusterCount", kind: "integer", label: "Balusters required" },
    {
      id: "actualClearGapMm",
      kind: "number",
      label: "Equal clear gap",
      unit: "mm",
    },
  ],
  calculate: (input) =>
    calculateBalusterSpacing4inch({
      clearOpeningMm: input.clearOpeningMm as number,
      balusterWidthMm: input.balusterWidthMm as number,
    }),
});
export const balusterSpacing4inchTool = tool;
export const runBalusterSpacing4inch = tool.execute;
export default tool;
