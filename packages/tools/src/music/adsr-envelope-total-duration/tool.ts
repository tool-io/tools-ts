import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type AdsrEnvelopeTotalDurationInput = Readonly<{
  readonly attackSeconds: number;
  readonly decaySeconds: number;
  readonly sustainHoldSeconds: number;
  readonly releaseSeconds: number;
}>;
export type AdsrEnvelopeTotalDurationOutput = Readonly<{
  readonly totalSeconds: number;
}>;

export const calculateAdsrEnvelopeTotalDuration = (
  x: AdsrEnvelopeTotalDurationInput,
): AdsrEnvelopeTotalDurationOutput => {
  if (!Number.isFinite(x.attackSeconds) || x.attackSeconds < 0)
    simpleError("attackSeconds", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.decaySeconds) || x.decaySeconds < 0)
    simpleError("decaySeconds", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.sustainHoldSeconds) || x.sustainHoldSeconds < 0)
    simpleError("sustainHoldSeconds", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.releaseSeconds) || x.releaseSeconds < 0)
    simpleError("releaseSeconds", "Provide a finite nonnegative number.");
  const totalSeconds =
    x.attackSeconds + x.decaySeconds + x.sustainHoldSeconds + x.releaseSeconds;
  if (!Number.isFinite(totalSeconds))
    simpleError(
      "totalSeconds",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { totalSeconds: Object.is(totalSeconds, -0) ? 0 : totalSeconds };
};

export const example = {
  input: {
    attackSeconds: 0.1,
    decaySeconds: 0.2,
    sustainHoldSeconds: 1,
    releaseSeconds: 0.5,
  },
  output: { totalSeconds: 1.8 },
} satisfies ToolExample<
  AdsrEnvelopeTotalDurationInput,
  AdsrEnvelopeTotalDurationOutput
>;

export const tool = createSimpleTool({
  id: "music/adsr-envelope-total-duration",
  title: "Adsr Envelope Total Duration",
  description:
    "Attack plus decay plus release duration in seconds; sustain hold duration must be provided explicitly.",
  inputs: [
    {
      id: "attackSeconds",
      kind: "number",
      label: "Attack Seconds",
      unit: "s",
      minimum: 0,
    },
    {
      id: "decaySeconds",
      kind: "number",
      label: "Decay Seconds",
      unit: "s",
      minimum: 0,
    },
    {
      id: "sustainHoldSeconds",
      kind: "number",
      label: "Sustain Hold Seconds",
      unit: "s",
      minimum: 0,
    },
    {
      id: "releaseSeconds",
      kind: "number",
      label: "Release Seconds",
      unit: "s",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "totalSeconds", kind: "number", label: "Total Seconds", unit: "s" },
  ],
  calculate: (input) =>
    calculateAdsrEnvelopeTotalDuration({
      attackSeconds: input.attackSeconds as number,
      decaySeconds: input.decaySeconds as number,
      sustainHoldSeconds: input.sustainHoldSeconds as number,
      releaseSeconds: input.releaseSeconds as number,
    }),
});
export const adsrEnvelopeTotalDurationTool = tool;
export const runAdsrEnvelopeTotalDuration = tool.execute;
export default tool;
