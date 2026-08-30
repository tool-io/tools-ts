import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RoofVentilationRatioInput = Readonly<{
  readonly atticSquareMeters: number;
  readonly netFreeVentSquareMeters: number;
}>;
export type RoofVentilationRatioOutput = Readonly<{
  readonly ratioDenominator: number;
}>;

export const calculateRoofVentilationRatio = (
  x: RoofVentilationRatioInput,
): RoofVentilationRatioOutput => {
  if (!Number.isFinite(x.atticSquareMeters) || x.atticSquareMeters < 0)
    simpleError("atticSquareMeters", "Provide a finite number at least 0.");
  if (
    !Number.isFinite(x.netFreeVentSquareMeters) ||
    x.netFreeVentSquareMeters < 0
  )
    simpleError(
      "netFreeVentSquareMeters",
      "Provide a finite number at least 0.",
    );
  const ratioDenominator = x.atticSquareMeters / x.netFreeVentSquareMeters;
  if (!Number.isFinite(ratioDenominator))
    simpleError(
      "ratioDenominator",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    ratioDenominator: Object.is(ratioDenominator, -0) ? 0 : ratioDenominator,
  };
};

export const example = {
  input: { atticSquareMeters: 150, netFreeVentSquareMeters: 1 },
  output: { ratioDenominator: 150 },
} satisfies ToolExample<RoofVentilationRatioInput, RoofVentilationRatioOutput>;

export const tool = createSimpleTool({
  id: "construction/roof-ventilation-ratio",
  title: "Roof Ventilation Ratio",
  description:
    "Attic-floor area divided by total net-free ventilation area, yielding the denominator of a 1:N area ratio; this is not a code approval.",
  inputs: [
    {
      id: "atticSquareMeters",
      kind: "number",
      label: "Attic Square Meters",
      unit: "m²",
      minimum: 0,
    },
    {
      id: "netFreeVentSquareMeters",
      kind: "number",
      label: "Net Free Vent Square Meters",
      unit: "m²",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "ratioDenominator", kind: "number", label: "Ratio Denominator" },
  ],
  calculate: (input) =>
    calculateRoofVentilationRatio({
      atticSquareMeters: input.atticSquareMeters as number,
      netFreeVentSquareMeters: input.netFreeVentSquareMeters as number,
    }),
});
export const roofVentilationRatioTool = tool;
export const runRoofVentilationRatio = tool.execute;
export default tool;
