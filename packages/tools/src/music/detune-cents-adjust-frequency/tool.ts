import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DetuneCentsAdjustFrequencyInput = Readonly<{
  readonly referenceHertz: number;
  readonly cents: number;
}>;
export type DetuneCentsAdjustFrequencyOutput = Readonly<{
  readonly targetHertz: number;
}>;

export const calculateDetuneCentsAdjustFrequency = (
  x: DetuneCentsAdjustFrequencyInput,
): DetuneCentsAdjustFrequencyOutput => {
  if (!Number.isFinite(x.referenceHertz) || x.referenceHertz <= 0)
    simpleError("referenceHertz", "Provide a finite positive number.");
  if (!Number.isFinite(x.cents))
    simpleError("cents", "Provide a finite number.");
  const targetHertz = x.referenceHertz * 2 ** (x.cents / 1200);
  if (!Number.isFinite(targetHertz))
    simpleError(
      "targetHertz",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { targetHertz: Object.is(targetHertz, -0) ? 0 : targetHertz };
};

export const example = {
  input: {
    referenceHertz: 440,
    cents: 1200,
  },
  output: { targetHertz: 880 },
} satisfies ToolExample<
  DetuneCentsAdjustFrequencyInput,
  DetuneCentsAdjustFrequencyOutput
>;

export const tool = createSimpleTool({
  id: "music/detune-cents-adjust-frequency",
  title: "Detune Cents Adjust Frequency",
  description:
    "Frequency after applying a signed cents offset to a positive reference frequency.",
  inputs: [
    {
      id: "referenceHertz",
      kind: "number",
      label: "Reference Hertz",
      unit: "Hz",
      minimum: 0,
    },
    { id: "cents", kind: "number", label: "Cents", unit: "cent" },
  ],
  outputs: [
    { id: "targetHertz", kind: "number", label: "Target Hertz", unit: "Hz" },
  ],
  calculate: (input) =>
    calculateDetuneCentsAdjustFrequency({
      referenceHertz: input.referenceHertz as number,
      cents: input.cents as number,
    }),
});
export const detuneCentsAdjustFrequencyTool = tool;
export const runDetuneCentsAdjustFrequency = tool.execute;
export default tool;
