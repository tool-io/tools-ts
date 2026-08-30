import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LedViewingAngleIntensityInput = Readonly<{
  readonly onAxisCandela: number;
  readonly halfIntensityDegrees: number;
  readonly offAxisDegrees: number;
}>;
export type LedViewingAngleIntensityOutput = Readonly<{
  readonly offAxisCandela: number;
}>;

export const calculateLedViewingAngleIntensity = (
  x: LedViewingAngleIntensityInput,
): LedViewingAngleIntensityOutput => {
  if (!Number.isFinite(x.onAxisCandela) || x.onAxisCandela < 0)
    simpleError("onAxisCandela", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.halfIntensityDegrees) || x.halfIntensityDegrees < 0)
    simpleError("halfIntensityDegrees", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.offAxisDegrees) || x.offAxisDegrees < 0)
    simpleError("offAxisDegrees", "Provide a finite number at least 0.");
  if (
    x.halfIntensityDegrees <= 0 ||
    x.halfIntensityDegrees >= 90 ||
    x.offAxisDegrees > 90
  )
    simpleError("input", "Inputs violate the stated model or operating range.");
  const offAxisCandela =
    x.onAxisCandela *
    Math.cos((x.offAxisDegrees * Math.PI) / 180) **
      (Math.log(0.5) /
        Math.log(Math.cos((x.halfIntensityDegrees * Math.PI) / 180)));
  if (!Number.isFinite(offAxisCandela))
    simpleError(
      "offAxisCandela",
      "Inputs produce an undefined or non-finite result.",
    );
  return { offAxisCandela: Object.is(offAxisCandela, -0) ? 0 : offAxisCandela };
};

export const example = {
  input: { onAxisCandela: 10, halfIntensityDegrees: 60, offAxisDegrees: 30 },
  output: { offAxisCandela: 8.660254037844387 },
} satisfies ToolExample<
  LedViewingAngleIntensityInput,
  LedViewingAngleIntensityOutput
>;

export const tool = createSimpleTool({
  id: "electronics/led-viewing-angle-intensity",
  title: "LED Viewing Angle Intensity",
  description:
    "LED off-axis luminous intensity under an empirical cosine-power angular model calibrated by the half-intensity angle.",
  inputs: [
    {
      id: "onAxisCandela",
      kind: "number",
      label: "On Axis Candela",
      unit: "cd",
      minimum: 0,
    },
    {
      id: "halfIntensityDegrees",
      kind: "number",
      label: "Half Intensity Degrees",
      unit: "°",
      minimum: 0,
    },
    {
      id: "offAxisDegrees",
      kind: "number",
      label: "Off Axis Degrees",
      unit: "°",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "offAxisCandela",
      kind: "number",
      label: "Off Axis Candela",
      unit: "cd",
    },
  ],
  calculate: (input) =>
    calculateLedViewingAngleIntensity({
      onAxisCandela: input.onAxisCandela as number,
      halfIntensityDegrees: input.halfIntensityDegrees as number,
      offAxisDegrees: input.offAxisDegrees as number,
    }),
});
export const ledViewingAngleIntensityTool = tool;
export const runLedViewingAngleIntensity = tool.execute;
export default tool;
