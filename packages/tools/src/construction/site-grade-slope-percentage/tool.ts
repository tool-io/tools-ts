import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SiteGradeSlopePercentageInput = Readonly<{
  readonly elevationChangeMeters: number;
  readonly horizontalRunMeters: number;
}>;
export type SiteGradeSlopePercentageOutput = Readonly<{
  readonly slopePercent: number;
}>;

export const calculateSiteGradeSlopePercentage = (
  x: SiteGradeSlopePercentageInput,
): SiteGradeSlopePercentageOutput => {
  if (!Number.isFinite(x.elevationChangeMeters))
    simpleError("elevationChangeMeters", "Provide a finite number.");
  if (!Number.isFinite(x.horizontalRunMeters) || x.horizontalRunMeters < 0)
    simpleError("horizontalRunMeters", "Provide a finite number at least 0.");
  const slopePercent = (100 * x.elevationChangeMeters) / x.horizontalRunMeters;
  if (!Number.isFinite(slopePercent))
    simpleError(
      "slopePercent",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { slopePercent: Object.is(slopePercent, -0) ? 0 : slopePercent };
};

export const example = {
  input: { elevationChangeMeters: 0.2, horizontalRunMeters: 10 },
  output: { slopePercent: 2 },
} satisfies ToolExample<
  SiteGradeSlopePercentageInput,
  SiteGradeSlopePercentageOutput
>;

export const tool = createSimpleTool({
  id: "construction/site-grade-slope-percentage",
  title: "Site Grade Slope Percentage",
  description:
    "Signed site grade percentage from elevation change divided by horizontal run; positive means the endpoint is higher.",
  inputs: [
    {
      id: "elevationChangeMeters",
      kind: "number",
      label: "Elevation Change Meters",
      unit: "m",
    },
    {
      id: "horizontalRunMeters",
      kind: "number",
      label: "Horizontal Run Meters",
      unit: "m",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "slopePercent", kind: "number", label: "Slope Percent", unit: "%" },
  ],
  calculate: (input) =>
    calculateSiteGradeSlopePercentage({
      elevationChangeMeters: input.elevationChangeMeters as number,
      horizontalRunMeters: input.horizontalRunMeters as number,
    }),
});
export const siteGradeSlopePercentageTool = tool;
export const runSiteGradeSlopePercentage = tool.execute;
export default tool;
