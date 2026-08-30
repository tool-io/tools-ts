import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CombinationToneSumInput = Readonly<{
  readonly firstHertz: number;
  readonly secondHertz: number;
}>;
export type CombinationToneSumOutput = Readonly<{
  readonly sumHertz: number;
}>;

export const calculateCombinationToneSum = (
  x: CombinationToneSumInput,
): CombinationToneSumOutput => {
  if (!Number.isFinite(x.firstHertz) || x.firstHertz <= 0)
    simpleError("firstHertz", "Provide a finite positive number.");
  if (!Number.isFinite(x.secondHertz) || x.secondHertz <= 0)
    simpleError("secondHertz", "Provide a finite positive number.");
  const sumHertz = x.firstHertz + x.secondHertz;
  if (!Number.isFinite(sumHertz))
    simpleError(
      "sumHertz",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { sumHertz: Object.is(sumHertz, -0) ? 0 : sumHertz };
};

export const example = {
  input: {
    firstHertz: 400,
    secondHertz: 600,
  },
  output: { sumHertz: 1000 },
} satisfies ToolExample<CombinationToneSumInput, CombinationToneSumOutput>;

export const tool = createSimpleTool({
  id: "acoustics/combination-tone-sum",
  title: "Combination Tone Sum",
  description:
    "Sum combination-tone frequency from two input sinusoid frequencies.",
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
  outputs: [{ id: "sumHertz", kind: "number", label: "Sum Hertz", unit: "Hz" }],
  calculate: (input) =>
    calculateCombinationToneSum({
      firstHertz: input.firstHertz as number,
      secondHertz: input.secondHertz as number,
    }),
});
export const combinationToneSumTool = tool;
export const runCombinationToneSum = tool.execute;
export default tool;
