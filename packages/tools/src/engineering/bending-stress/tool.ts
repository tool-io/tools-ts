import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BendingStressInput = Readonly<{
  readonly momentNewtonMeters: number;
  readonly extremeFiberMeters: number;
  readonly secondMomentMeters4: number;
}>;
export type BendingStressOutput = Readonly<{
  readonly stressPascals: number;
}>;

export const calculateBendingStress = (
  x: BendingStressInput,
): BendingStressOutput => {
  if (!Number.isFinite(x.momentNewtonMeters) || x.momentNewtonMeters < 0)
    simpleError("momentNewtonMeters", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.extremeFiberMeters) || x.extremeFiberMeters < 0)
    simpleError("extremeFiberMeters", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.secondMomentMeters4) || x.secondMomentMeters4 < 0)
    simpleError("secondMomentMeters4", "Provide a finite number at least 0.");
  const stressPascals =
    (x.momentNewtonMeters * x.extremeFiberMeters) / x.secondMomentMeters4;
  if (!Number.isFinite(stressPascals))
    simpleError(
      "stressPascals",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { stressPascals: Object.is(stressPascals, -0) ? 0 : stressPascals };
};

export const example = {
  input: {
    momentNewtonMeters: 1000,
    extremeFiberMeters: 0.05,
    secondMomentMeters4: 0.00001,
  },
  output: { stressPascals: 5000000 },
} satisfies ToolExample<BendingStressInput, BendingStressOutput>;

export const tool = createSimpleTool({
  id: "engineering/bending-stress",
  title: "Bending Stress",
  description:
    "Extreme-fiber bending stress magnitude in an elastic beam section from bending moment, neutral-axis distance and second moment.",
  inputs: [
    {
      id: "momentNewtonMeters",
      kind: "number",
      label: "Moment Newton Meters",
      unit: "N·m",
      minimum: 0,
    },
    {
      id: "extremeFiberMeters",
      kind: "number",
      label: "Extreme Fiber Meters",
      unit: "m",
      minimum: 0,
    },
    {
      id: "secondMomentMeters4",
      kind: "number",
      label: "Second Moment Meters4",
      unit: "m⁴",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "stressPascals",
      kind: "number",
      label: "Stress Pascals",
      unit: "Pa",
    },
  ],
  calculate: (input) =>
    calculateBendingStress({
      momentNewtonMeters: input.momentNewtonMeters as number,
      extremeFiberMeters: input.extremeFiberMeters as number,
      secondMomentMeters4: input.secondMomentMeters4 as number,
    }),
});
export const bendingStressTool = tool;
export const runBendingStress = tool.execute;
export default tool;
