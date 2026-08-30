import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type HarmonicSeriesPartialFrequencyInput = Readonly<{
  readonly fundamentalHertz: number;
  readonly partialNumber: number;
}>;
export type HarmonicSeriesPartialFrequencyOutput = Readonly<{
  readonly partialHertz: number;
}>;

export const calculateHarmonicSeriesPartialFrequency = (
  x: HarmonicSeriesPartialFrequencyInput,
): HarmonicSeriesPartialFrequencyOutput => {
  if (!Number.isFinite(x.fundamentalHertz) || x.fundamentalHertz <= 0)
    simpleError("fundamentalHertz", "Provide a finite positive number.");
  if (
    !Number.isFinite(x.partialNumber) ||
    !Number.isSafeInteger(x.partialNumber) ||
    x.partialNumber < 1
  )
    simpleError("partialNumber", "Provide a positive safe integer.");
  const partialHertz = x.fundamentalHertz * x.partialNumber;
  if (!Number.isFinite(partialHertz))
    simpleError(
      "partialHertz",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { partialHertz: Object.is(partialHertz, -0) ? 0 : partialHertz };
};

export const example = {
  input: {
    fundamentalHertz: 100,
    partialNumber: 3,
  },
  output: { partialHertz: 300 },
} satisfies ToolExample<
  HarmonicSeriesPartialFrequencyInput,
  HarmonicSeriesPartialFrequencyOutput
>;

export const tool = createSimpleTool({
  id: "music/harmonic-series-partial-frequency",
  title: "Harmonic Series Partial Frequency",
  description:
    "Frequency of a harmonic partial from a positive fundamental and positive integer partial number.",
  inputs: [
    {
      id: "fundamentalHertz",
      kind: "number",
      label: "Fundamental Hertz",
      unit: "Hz",
      minimum: 0,
    },
    {
      id: "partialNumber",
      kind: "integer",
      label: "Partial Number",
      minimum: 1,
    },
  ],
  outputs: [
    { id: "partialHertz", kind: "number", label: "Partial Hertz", unit: "Hz" },
  ],
  calculate: (input) =>
    calculateHarmonicSeriesPartialFrequency({
      fundamentalHertz: input.fundamentalHertz as number,
      partialNumber: input.partialNumber as number,
    }),
});
export const harmonicSeriesPartialFrequencyTool = tool;
export const runHarmonicSeriesPartialFrequency = tool.execute;
export default tool;
