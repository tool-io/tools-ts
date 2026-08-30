import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FuseClearingTimeInput = Readonly<{
  readonly clearingAmpereSquaredSeconds: number;
  readonly faultRmsAmperes: number;
}>;
export type FuseClearingTimeOutput = Readonly<{
  readonly clearingSeconds: number;
}>;

export const calculateFuseClearingTime = (
  x: FuseClearingTimeInput,
): FuseClearingTimeOutput => {
  if (
    !Number.isFinite(x.clearingAmpereSquaredSeconds) ||
    x.clearingAmpereSquaredSeconds < 0
  )
    simpleError(
      "clearingAmpereSquaredSeconds",
      "Provide a finite number at least 0.",
    );
  if (!Number.isFinite(x.faultRmsAmperes) || x.faultRmsAmperes < 0)
    simpleError("faultRmsAmperes", "Provide a finite number at least 0.");
  const clearingSeconds =
    x.clearingAmpereSquaredSeconds / x.faultRmsAmperes ** 2;
  if (!Number.isFinite(clearingSeconds))
    simpleError(
      "clearingSeconds",
      "Inputs produce an undefined or non-finite result.",
    );
  return {
    clearingSeconds: Object.is(clearingSeconds, -0) ? 0 : clearingSeconds,
  };
};

export const example = {
  input: { clearingAmpereSquaredSeconds: 100, faultRmsAmperes: 10 },
  output: { clearingSeconds: 1 },
} satisfies ToolExample<FuseClearingTimeInput, FuseClearingTimeOutput>;

export const tool = createSimpleTool({
  id: "electronics/fuse-clearing-time",
  title: "Fuse Clearing Time",
  description:
    "Approximate clearing time from a fuse's specified clearing I²t at constant prospective RMS fault current; actual waveform and arc time may differ.",
  inputs: [
    {
      id: "clearingAmpereSquaredSeconds",
      kind: "number",
      label: "Clearing Ampere Squared Seconds",
      unit: "A²s",
      minimum: 0,
    },
    {
      id: "faultRmsAmperes",
      kind: "number",
      label: "Fault Rms Amperes",
      unit: "A",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "clearingSeconds",
      kind: "number",
      label: "Clearing Seconds",
      unit: "s",
    },
  ],
  calculate: (input) =>
    calculateFuseClearingTime({
      clearingAmpereSquaredSeconds:
        input.clearingAmpereSquaredSeconds as number,
      faultRmsAmperes: input.faultRmsAmperes as number,
    }),
});
export const fuseClearingTimeTool = tool;
export const runFuseClearingTime = tool.execute;
export default tool;
