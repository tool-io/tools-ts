import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BeatsFrequencyInput = Readonly<{
  readonly firstHertz: number;
  readonly secondHertz: number;
}>;
export type BeatsFrequencyOutput = Readonly<{
  readonly beatHertz: number;
}>;

export const calculateBeatsFrequency = (
  x: BeatsFrequencyInput,
): BeatsFrequencyOutput => {
  if (!Number.isFinite(x.firstHertz) || x.firstHertz <= 0)
    simpleError("firstHertz", "Provide a finite positive number.");
  if (!Number.isFinite(x.secondHertz) || x.secondHertz <= 0)
    simpleError("secondHertz", "Provide a finite positive number.");
  const beatHertz = Math.abs(x.firstHertz - x.secondHertz);
  if (!Number.isFinite(beatHertz))
    simpleError(
      "beatHertz",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { beatHertz: Object.is(beatHertz, -0) ? 0 : beatHertz };
};

export const example = {
  input: {
    firstHertz: 440,
    secondHertz: 442,
  },
  output: { beatHertz: 2 },
} satisfies ToolExample<BeatsFrequencyInput, BeatsFrequencyOutput>;

export const tool = createSimpleTool({
  id: "acoustics/beats-frequency",
  title: "Beats Frequency",
  description:
    "Beat rate in hertz from the absolute frequency difference of two close tones.",
  inputs: [
    {
      id: "firstHertz",
      kind: "number",
      label: "First Hertz",
      unit: "Hz",
      minimum: 0,
    },
    {
      id: "secondHertz",
      kind: "number",
      label: "Second Hertz",
      unit: "Hz",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "beatHertz", kind: "number", label: "Beat Hertz", unit: "Hz" },
  ],
  calculate: (input) =>
    calculateBeatsFrequency({
      firstHertz: input.firstHertz as number,
      secondHertz: input.secondHertz as number,
    }),
});
export const beatsFrequencyTool = tool;
export const runBeatsFrequency = tool.execute;
export default tool;
