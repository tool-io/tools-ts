import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FlickerFrequencyInput = Readonly<{
  readonly cycleCount: number;
  readonly elapsedSeconds: number;
}>;
export type FlickerFrequencyOutput = Readonly<{
  readonly frequencyHertz: number;
}>;

export const calculateFlickerFrequency = (
  x: FlickerFrequencyInput,
): FlickerFrequencyOutput => {
  if (!Number.isFinite(x.cycleCount) || x.cycleCount < 0)
    simpleError("cycleCount", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.elapsedSeconds) || x.elapsedSeconds < 0)
    simpleError("elapsedSeconds", "Provide a finite number at least 0.");
  if (!Number.isSafeInteger(x.cycleCount))
    simpleError("input", "Inputs violate the stated model or operating range.");
  const frequencyHertz = x.cycleCount / x.elapsedSeconds;
  if (!Number.isFinite(frequencyHertz))
    simpleError(
      "frequencyHertz",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { frequencyHertz: Object.is(frequencyHertz, -0) ? 0 : frequencyHertz };
};

export const example = {
  input: { cycleCount: 100, elapsedSeconds: 2 },
  output: { frequencyHertz: 50 },
} satisfies ToolExample<FlickerFrequencyInput, FlickerFrequencyOutput>;

export const tool = createSimpleTool({
  id: "film/flicker-frequency",
  title: "Flicker Frequency",
  description:
    "Flicker frequency from observed light-output cycles over a measured time interval.",
  inputs: [
    { id: "cycleCount", kind: "integer", label: "Cycle Count", minimum: 0 },
    {
      id: "elapsedSeconds",
      kind: "number",
      label: "Elapsed Seconds",
      unit: "s",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "frequencyHertz",
      kind: "number",
      label: "Frequency Hertz",
      unit: "Hz",
    },
  ],
  calculate: (input) =>
    calculateFlickerFrequency({
      cycleCount: input.cycleCount as number,
      elapsedSeconds: input.elapsedSeconds as number,
    }),
});
export const flickerFrequencyTool = tool;
export const runFlickerFrequency = tool.execute;
export default tool;
