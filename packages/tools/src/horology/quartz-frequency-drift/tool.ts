import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type QuartzFrequencyDriftInput = Readonly<{
  readonly measuredHertz: number;
  readonly nominalHertz: number;
}>;
export type QuartzFrequencyDriftOutput = Readonly<{
  readonly errorPpm: number;
}>;

export const calculateQuartzFrequencyDrift = (
  x: QuartzFrequencyDriftInput,
): QuartzFrequencyDriftOutput => {
  if (!Number.isFinite(x.measuredHertz) || x.measuredHertz <= 0)
    simpleError("measuredHertz", "Provide a finite positive number.");
  if (!Number.isFinite(x.nominalHertz) || x.nominalHertz <= 0)
    simpleError("nominalHertz", "Provide a finite positive number.");
  const errorPpm = 1e6 * (x.measuredHertz / x.nominalHertz - 1);
  if (!Number.isFinite(errorPpm))
    simpleError(
      "errorPpm",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { errorPpm: Object.is(errorPpm, -0) ? 0 : errorPpm };
};

export const example = {
  input: {
    measuredHertz: 32768.32768,
    nominalHertz: 32768,
  },
  output: { errorPpm: 10.000000000065512 },
} satisfies ToolExample<QuartzFrequencyDriftInput, QuartzFrequencyDriftOutput>;

export const tool = createSimpleTool({
  id: "horology/quartz-frequency-drift",
  title: "Quartz Frequency Drift",
  description:
    "Signed quartz oscillator frequency error in parts per million relative to nominal frequency.",
  inputs: [
    {
      id: "measuredHertz",
      kind: "number",
      label: "Measured Hertz",
      unit: "Hz",
      minimum: 0,
    },
    {
      id: "nominalHertz",
      kind: "number",
      label: "Nominal Hertz",
      unit: "Hz",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "errorPpm", kind: "number", label: "Error Ppm", unit: "ppm" },
  ],
  calculate: (input) =>
    calculateQuartzFrequencyDrift({
      measuredHertz: input.measuredHertz as number,
      nominalHertz: input.nominalHertz as number,
    }),
});
export const quartzFrequencyDriftTool = tool;
export const runQuartzFrequencyDrift = tool.execute;
export default tool;
