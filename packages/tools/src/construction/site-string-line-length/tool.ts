import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SiteStringLineLengthInput = Readonly<{
  readonly horizontalMeters: number;
  readonly verticalMeters: number;
}>;
export type SiteStringLineLengthOutput = Readonly<{
  readonly lengthMeters: number;
}>;

export const calculateSiteStringLineLength = (
  x: SiteStringLineLengthInput,
): SiteStringLineLengthOutput => {
  if (!Number.isFinite(x.horizontalMeters))
    simpleError("horizontalMeters", "Provide a finite number.");
  if (!Number.isFinite(x.verticalMeters))
    simpleError("verticalMeters", "Provide a finite number.");
  const lengthMeters = Math.hypot(x.horizontalMeters, x.verticalMeters);
  if (!Number.isFinite(lengthMeters))
    simpleError(
      "lengthMeters",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { lengthMeters: Object.is(lengthMeters, -0) ? 0 : lengthMeters };
};

export const example = {
  input: { horizontalMeters: 3, verticalMeters: 4 },
  output: { lengthMeters: 5 },
} satisfies ToolExample<SiteStringLineLengthInput, SiteStringLineLengthOutput>;

export const tool = createSimpleTool({
  id: "construction/site-string-line-length",
  title: "Site String Line Length",
  description:
    "Straight string-line distance between two measured planar site-layout points; sag and terrain elevation are excluded.",
  inputs: [
    {
      id: "horizontalMeters",
      kind: "number",
      label: "Horizontal Meters",
      unit: "m",
    },
    {
      id: "verticalMeters",
      kind: "number",
      label: "Vertical Meters",
      unit: "m",
    },
  ],
  outputs: [
    { id: "lengthMeters", kind: "number", label: "Length Meters", unit: "m" },
  ],
  calculate: (input) =>
    calculateSiteStringLineLength({
      horizontalMeters: input.horizontalMeters as number,
      verticalMeters: input.verticalMeters as number,
    }),
});
export const siteStringLineLengthTool = tool;
export const runSiteStringLineLength = tool.execute;
export default tool;
