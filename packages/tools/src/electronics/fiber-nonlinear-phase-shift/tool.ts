import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FiberNonlinearPhaseShiftInput = Readonly<{
  readonly nonlinearCoefficientPerWKm: number;
  readonly launchedPowerW: number;
  readonly effectiveLengthKm: number;
}>;
export type FiberNonlinearPhaseShiftOutput = Readonly<{
  readonly nonlinearPhaseRad: number;
}>;

export const calculateFiberNonlinearPhaseShift = (
  x: FiberNonlinearPhaseShiftInput,
): FiberNonlinearPhaseShiftOutput => {
  if (
    !Number.isFinite(x.nonlinearCoefficientPerWKm) ||
    x.nonlinearCoefficientPerWKm < 0
  )
    simpleError(
      "nonlinearCoefficientPerWKm",
      "Provide a finite number at least 0.",
    );
  if (!Number.isFinite(x.launchedPowerW) || x.launchedPowerW < 0)
    simpleError("launchedPowerW", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.effectiveLengthKm) || x.effectiveLengthKm < 0)
    simpleError("effectiveLengthKm", "Provide a finite number at least 0.");
  const nonlinearPhaseRad =
    x.nonlinearCoefficientPerWKm * x.launchedPowerW * x.effectiveLengthKm;
  if (!Number.isFinite(nonlinearPhaseRad))
    simpleError("nonlinearPhaseRad", "The inputs produce an invalid result.");
  return {
    nonlinearPhaseRad: Object.is(nonlinearPhaseRad, -0) ? 0 : nonlinearPhaseRad,
  };
};

export const example = {
  input: {
    nonlinearCoefficientPerWKm: 1.3,
    launchedPowerW: 0.01,
    effectiveLengthKm: 10,
  },
  output: { nonlinearPhaseRad: 0.13 },
} satisfies ToolExample<
  FiberNonlinearPhaseShiftInput,
  FiberNonlinearPhaseShiftOutput
>;

export const tool = createSimpleTool({
  id: "electronics/fiber-nonlinear-phase-shift",
  title: "Fiber Nonlinear Phase Shift",
  description:
    "Estimate self-phase modulation accumulated in a fiber from nonlinear coefficient, launched power, and attenuation-adjusted effective length.",
  inputs: [
    {
      id: "nonlinearCoefficientPerWKm",
      kind: "number",
      label: "Nonlinear coefficient",
      unit: "1/(W·km)",
      minimum: 0,
    },
    {
      id: "launchedPowerW",
      kind: "number",
      label: "Launched optical power",
      unit: "W",
      minimum: 0,
    },
    {
      id: "effectiveLengthKm",
      kind: "number",
      label: "Effective fiber length",
      unit: "km",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "nonlinearPhaseRad",
      kind: "number",
      label: "Nonlinear phase shift",
      unit: "rad",
    },
  ],
  calculate: (input) =>
    calculateFiberNonlinearPhaseShift({
      nonlinearCoefficientPerWKm: input.nonlinearCoefficientPerWKm as number,
      launchedPowerW: input.launchedPowerW as number,
      effectiveLengthKm: input.effectiveLengthKm as number,
    }),
});
export const fiberNonlinearPhaseShiftTool = tool;
export const runFiberNonlinearPhaseShift = tool.execute;
export default tool;
