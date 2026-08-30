import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DifferenceToneFrequencyInput = Readonly<{
  readonly firstHertz: number;
  readonly secondHertz: number;
}>;
export type DifferenceToneFrequencyOutput = Readonly<{
  readonly differenceHertz: number;
}>;

export const calculateDifferenceToneFrequency = (
  x: DifferenceToneFrequencyInput,
): DifferenceToneFrequencyOutput => {
  if (!Number.isFinite(x.firstHertz) || x.firstHertz <= 0)
    simpleError("firstHertz", "Provide a finite positive number.");
  if (!Number.isFinite(x.secondHertz) || x.secondHertz <= 0)
    simpleError("secondHertz", "Provide a finite positive number.");
  const differenceHertz = Math.abs(x.firstHertz - x.secondHertz);
  if (!Number.isFinite(differenceHertz))
    simpleError(
      "differenceHertz",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    differenceHertz: Object.is(differenceHertz, -0) ? 0 : differenceHertz,
  };
};

export const example = {
  input: {
    firstHertz: 400,
    secondHertz: 600,
  },
  output: { differenceHertz: 200 },
} satisfies ToolExample<
  DifferenceToneFrequencyInput,
  DifferenceToneFrequencyOutput
>;

export const tool = createSimpleTool({
  id: "acoustics/difference-tone-frequency",
  title: "Difference Tone Frequency",
  description:
    "Absolute difference combination-tone frequency from two input sinusoid frequencies.",
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
    {
      id: "differenceHertz",
      kind: "number",
      label: "Difference Hertz",
      unit: "Hz",
    },
  ],
  calculate: (input) =>
    calculateDifferenceToneFrequency({
      firstHertz: input.firstHertz as number,
      secondHertz: input.secondHertz as number,
    }),
});
export const differenceToneFrequencyTool = tool;
export const runDifferenceToneFrequency = tool.execute;
export default tool;
