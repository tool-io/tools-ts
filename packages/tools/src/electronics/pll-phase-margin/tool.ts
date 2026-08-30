import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PllPhaseMarginInput = Readonly<{
  readonly phaseAtUnityGainDegrees: number;
}>;
export type PllPhaseMarginOutput = Readonly<{
  readonly phaseMarginDegrees: number;
}>;

export const calculatePllPhaseMargin = (
  x: PllPhaseMarginInput,
): PllPhaseMarginOutput => {
  if (!Number.isFinite(x.phaseAtUnityGainDegrees))
    simpleError("phaseAtUnityGainDegrees", "Provide a finite number.");
  const phaseMarginDegrees = 180 + x.phaseAtUnityGainDegrees;
  if (!Number.isFinite(phaseMarginDegrees))
    simpleError("phaseMarginDegrees", "The inputs produce an invalid result.");
  return {
    phaseMarginDegrees: Object.is(phaseMarginDegrees, -0)
      ? 0
      : phaseMarginDegrees,
  };
};

export const example = {
  input: { phaseAtUnityGainDegrees: -135 },
  output: { phaseMarginDegrees: 45 },
} satisfies ToolExample<PllPhaseMarginInput, PllPhaseMarginOutput>;

export const tool = createSimpleTool({
  id: "electronics/pll-phase-margin",
  title: "PLL Phase Margin",
  description:
    "Calculate loop phase margin from unwrapped open-loop phase at the unity-gain crossover frequency.",
  inputs: [
    {
      id: "phaseAtUnityGainDegrees",
      kind: "number",
      label: "Loop phase at 0 dB",
      unit: "°",
    },
  ],
  outputs: [
    {
      id: "phaseMarginDegrees",
      kind: "number",
      label: "Phase margin",
      unit: "°",
    },
  ],
  calculate: (input) =>
    calculatePllPhaseMargin({
      phaseAtUnityGainDegrees: input.phaseAtUnityGainDegrees as number,
    }),
});
export const pllPhaseMarginTool = tool;
export const runPllPhaseMargin = tool.execute;
export default tool;
