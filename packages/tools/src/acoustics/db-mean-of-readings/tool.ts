import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DbMeanOfReadingsInput = Readonly<{
  readonly firstDecibels: number;
  readonly secondDecibels: number;
}>;
export type DbMeanOfReadingsOutput = Readonly<{
  readonly meanDecibels: number;
}>;

export const calculateDbMeanOfReadings = (
  x: DbMeanOfReadingsInput,
): DbMeanOfReadingsOutput => {
  if (!Number.isFinite(x.firstDecibels))
    simpleError("firstDecibels", "Provide a finite number.");
  if (!Number.isFinite(x.secondDecibels))
    simpleError("secondDecibels", "Provide a finite number.");
  const meanDecibels =
    10 *
    Math.log10(
      (10 ** (x.firstDecibels / 10) + 10 ** (x.secondDecibels / 10)) / 2,
    );
  if (!Number.isFinite(meanDecibels))
    simpleError(
      "meanDecibels",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { meanDecibels: Object.is(meanDecibels, -0) ? 0 : meanDecibels };
};

export const example = {
  input: {
    firstDecibels: 60,
    secondDecibels: 60,
  },
  output: { meanDecibels: 60 },
} satisfies ToolExample<DbMeanOfReadingsInput, DbMeanOfReadingsOutput>;

export const tool = createSimpleTool({
  id: "acoustics/db-mean-of-readings",
  title: "Db Mean Of Readings",
  description:
    "Energetic mean, not arithmetic mean, of two equal-duration sound-level readings.",
  inputs: [
    {
      id: "firstDecibels",
      kind: "number",
      label: "First Decibels",
      unit: "dB",
    },
    {
      id: "secondDecibels",
      kind: "number",
      label: "Second Decibels",
      unit: "dB",
    },
  ],
  outputs: [
    { id: "meanDecibels", kind: "number", label: "Mean Decibels", unit: "dB" },
  ],
  calculate: (input) =>
    calculateDbMeanOfReadings({
      firstDecibels: input.firstDecibels as number,
      secondDecibels: input.secondDecibels as number,
    }),
});
export const dbMeanOfReadingsTool = tool;
export const runDbMeanOfReadings = tool.execute;
export default tool;
