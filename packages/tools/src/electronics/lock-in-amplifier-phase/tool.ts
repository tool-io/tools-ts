import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LockInAmplifierPhaseInput = Readonly<{
  readonly inPhaseVolts: number;
  readonly quadratureVolts: number;
}>;
export type LockInAmplifierPhaseOutput = Readonly<{
  readonly phaseDegrees: number;
}>;

export const calculateLockInAmplifierPhase = (
  x: LockInAmplifierPhaseInput,
): LockInAmplifierPhaseOutput => {
  if (!Number.isFinite(x.inPhaseVolts))
    simpleError("inPhaseVolts", "Provide a finite number.");
  if (!Number.isFinite(x.quadratureVolts))
    simpleError("quadratureVolts", "Provide a finite number.");
  if (x.inPhaseVolts === 0 && x.quadratureVolts === 0)
    simpleError("input", "Inputs violate the stated model or operating range.");
  const phaseDegrees =
    (Math.atan2(x.quadratureVolts, x.inPhaseVolts) * 180) / Math.PI;
  if (!Number.isFinite(phaseDegrees))
    simpleError(
      "phaseDegrees",
      "Inputs produce an undefined or non-finite result.",
    );
  return { phaseDegrees: Object.is(phaseDegrees, -0) ? 0 : phaseDegrees };
};

export const example = {
  input: { inPhaseVolts: 1, quadratureVolts: 1 },
  output: { phaseDegrees: 45 },
} satisfies ToolExample<LockInAmplifierPhaseInput, LockInAmplifierPhaseOutput>;

export const tool = createSimpleTool({
  id: "electronics/lock-in-amplifier-phase",
  title: "Lock In Amplifier Phase",
  description:
    "Demodulated lock-in phase angle from signed in-phase and quadrature components.",
  inputs: [
    { id: "inPhaseVolts", kind: "number", label: "In Phase Volts", unit: "V" },
    {
      id: "quadratureVolts",
      kind: "number",
      label: "Quadrature Volts",
      unit: "V",
    },
  ],
  outputs: [
    { id: "phaseDegrees", kind: "number", label: "Phase Degrees", unit: "°" },
  ],
  calculate: (input) =>
    calculateLockInAmplifierPhase({
      inPhaseVolts: input.inPhaseVolts as number,
      quadratureVolts: input.quadratureVolts as number,
    }),
});
export const lockInAmplifierPhaseTool = tool;
export const runLockInAmplifierPhase = tool.execute;
export default tool;
