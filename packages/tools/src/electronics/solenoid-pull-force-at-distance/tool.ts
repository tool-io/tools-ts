import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SolenoidPullForceAtDistanceInput = Readonly<{
  readonly turnCount: number;
  readonly currentAmperes: number;
  readonly poleAreaSquareMeters: number;
  readonly airGapMeters: number;
}>;
export type SolenoidPullForceAtDistanceOutput = Readonly<{
  pullForceNewtons: number;
}>;

export const calculateSolenoidPullForceAtDistance = (
  i: SolenoidPullForceAtDistanceInput,
): SolenoidPullForceAtDistanceOutput => {
  if (!Number.isSafeInteger(i.turnCount))
    simpleError("turnCount", "Turn count must be an integer.");
  const value =
    (4 *
      Math.PI *
      1e-7 *
      (i.turnCount * i.currentAmperes) ** 2 *
      i.poleAreaSquareMeters) /
    (2 * i.airGapMeters ** 2);
  if (!Number.isFinite(value))
    simpleError("pullForceNewtons", "The inputs produce a non-finite result.");
  return { pullForceNewtons: Object.is(value, -0) ? 0 : value };
};

export const example = {
  input: {
    turnCount: 500,
    currentAmperes: 1,
    poleAreaSquareMeters: 0.0001,
    airGapMeters: 0.002,
  },
  output: { pullForceNewtons: 3.926990816987242 },
} satisfies ToolExample<
  SolenoidPullForceAtDistanceInput,
  SolenoidPullForceAtDistanceOutput
>;

export const tool = createSimpleTool({
  id: "electronics/solenoid-pull-force-at-distance",
  title: "Solenoid Pull Force At Distance",
  description:
    "Estimate ideal solenoid attraction across one air gap as μ0(NI)²A/(2g²); assumes negligible leakage, fringing, saturation, and iron reluctance.",
  inputs: [
    {
      id: "turnCount",
      kind: "integer",
      label: "Turn Count",
      minimum: Number.MIN_VALUE,
    },
    {
      id: "currentAmperes",
      kind: "number",
      label: "Current (A)",
      unit: "A",
      minimum: 0,
    },
    {
      id: "poleAreaSquareMeters",
      kind: "number",
      label: "Pole Area (m²)",
      unit: "m²",
      minimum: Number.MIN_VALUE,
    },
    {
      id: "airGapMeters",
      kind: "number",
      label: "Air Gap (m)",
      unit: "m",
      minimum: Number.MIN_VALUE,
    },
  ],
  outputs: [
    { id: "pullForceNewtons", kind: "number", label: "Pull Force Newtons" },
  ],
  calculate: (input) =>
    calculateSolenoidPullForceAtDistance({
      turnCount: input.turnCount as number,
      currentAmperes: input.currentAmperes as number,
      poleAreaSquareMeters: input.poleAreaSquareMeters as number,
      airGapMeters: input.airGapMeters as number,
    }),
});
export const solenoidPullForceAtDistanceTool = tool;
export const runSolenoidPullForceAtDistance = tool.execute;
export default tool;
