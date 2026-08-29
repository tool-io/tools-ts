import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const example = {
  input: {
    baselineDistance: 1000,
    headwindKt: 5,
    tailwindKt: 0,
    headwindReductionPercentPerKt: 1,
    tailwindIncreasePercentPerKt: 2,
    safetyFactor: 1.15,
  },
  output: { adjustedDistance: 1092.5 },
} satisfies ToolExample<Record<string, number>, Record<string, number>>;
export const tool = createSimpleTool({
  id: "aviation/landing-distance-required-with-wind",
  title: "Landing Distance With Wind",
  description:
    "Apply user-provided distance adjustments per knot of headwind or tailwind to a baseline landing distance, then multiply by a chosen safety factor. The percentages must come from the aircraft's approved performance data; no universal wind correction exists.",
  inputs: [
    {
      id: "baselineDistance",
      kind: "number",
      label: "Baseline landing distance",
      minimum: 0,
    },
    {
      id: "headwindKt",
      kind: "number",
      label: "Headwind component (kt)",
      minimum: 0,
    },
    {
      id: "tailwindKt",
      kind: "number",
      label: "Tailwind component (kt)",
      minimum: 0,
    },
    {
      id: "headwindReductionPercentPerKt",
      kind: "number",
      label: "Headwind reduction (%/kt)",
      minimum: 0,
    },
    {
      id: "tailwindIncreasePercentPerKt",
      kind: "number",
      label: "Tailwind increase (%/kt)",
      minimum: 0,
    },
    {
      id: "safetyFactor",
      kind: "number",
      label: "Safety factor",
      minimum: 1,
    },
  ],
  outputs: [
    { id: "adjustedDistance", kind: "number", label: "Adjusted Distance" },
  ],
  calculate: (input) => {
    const i = input as Record<string, number>;
    if (i.headwindKt > 0 && i.tailwindKt > 0)
      simpleError("tailwindKt", "Enter either headwind or tailwind, not both.");
    if (
      1 -
        (i.headwindKt * i.headwindReductionPercentPerKt) / 100 +
        (i.tailwindKt * i.tailwindIncreasePercentPerKt) / 100 <=
      0
    )
      simpleError(
        "headwindReductionPercentPerKt",
        "Wind correction must leave a positive distance.",
      );
    const output = {
      adjustedDistance:
        i.baselineDistance *
        (1 -
          (i.headwindKt * i.headwindReductionPercentPerKt) / 100 +
          (i.tailwindKt * i.tailwindIncreasePercentPerKt) / 100) *
        i.safetyFactor,
    };
    for (const [field, value] of Object.entries(output))
      if (!Number.isFinite(value))
        simpleError(field, "The inputs produce a non-finite result.");
    return output;
  },
});
export type LandingDistanceRequiredWithWindInput = Readonly<
  typeof example.input
>;
export type LandingDistanceRequiredWithWindOutput = Readonly<
  typeof example.output
>;
export const landingDistanceRequiredWithWindTool = tool;
export const runLandingDistanceRequiredWithWind = tool.execute;
export default tool;
