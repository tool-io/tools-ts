import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SubharmonicFrequencyInput = Readonly<{
  readonly fundamentalHertz: number;
  readonly subharmonicNumber: number;
}>;
export type SubharmonicFrequencyOutput = Readonly<{
  readonly subharmonicHertz: number;
}>;

export const calculateSubharmonicFrequency = (
  x: SubharmonicFrequencyInput,
): SubharmonicFrequencyOutput => {
  if (!Number.isFinite(x.fundamentalHertz) || x.fundamentalHertz <= 0)
    simpleError("fundamentalHertz", "Provide a finite positive number.");
  if (
    !Number.isFinite(x.subharmonicNumber) ||
    !Number.isSafeInteger(x.subharmonicNumber) ||
    x.subharmonicNumber < 1
  )
    simpleError("subharmonicNumber", "Provide a positive safe integer.");
  const subharmonicHertz = x.fundamentalHertz / x.subharmonicNumber;
  if (!Number.isFinite(subharmonicHertz))
    simpleError(
      "subharmonicHertz",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    subharmonicHertz: Object.is(subharmonicHertz, -0) ? 0 : subharmonicHertz,
  };
};

export const example = {
  input: {
    fundamentalHertz: 300,
    subharmonicNumber: 3,
  },
  output: { subharmonicHertz: 100 },
} satisfies ToolExample<SubharmonicFrequencyInput, SubharmonicFrequencyOutput>;

export const tool = createSimpleTool({
  id: "music/subharmonic-frequency",
  title: "Subharmonic Frequency",
  description: "Frequency of an integer subharmonic of a positive fundamental.",
  inputs: [
    {
      id: "fundamentalHertz",
      kind: "number",
      label: "Fundamental Hertz",
      unit: "Hz",
      minimum: 0,
    },
    {
      id: "subharmonicNumber",
      kind: "integer",
      label: "Subharmonic Number",
      minimum: 1,
    },
  ],
  outputs: [
    {
      id: "subharmonicHertz",
      kind: "number",
      label: "Subharmonic Hertz",
      unit: "Hz",
    },
  ],
  calculate: (input) =>
    calculateSubharmonicFrequency({
      fundamentalHertz: input.fundamentalHertz as number,
      subharmonicNumber: input.subharmonicNumber as number,
    }),
});
export const subharmonicFrequencyTool = tool;
export const runSubharmonicFrequency = tool.execute;
export default tool;
