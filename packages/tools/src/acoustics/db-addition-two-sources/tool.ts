import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DbAdditionTwoSourcesInput = Readonly<{
  readonly firstDecibels: number;
  readonly secondDecibels: number;
}>;
export type DbAdditionTwoSourcesOutput = Readonly<{
  readonly combinedDecibels: number;
}>;

export const calculateDbAdditionTwoSources = (
  x: DbAdditionTwoSourcesInput,
): DbAdditionTwoSourcesOutput => {
  if (!Number.isFinite(x.firstDecibels))
    simpleError("firstDecibels", "Provide a finite number.");
  if (!Number.isFinite(x.secondDecibels))
    simpleError("secondDecibels", "Provide a finite number.");
  const combinedDecibels =
    10 *
    Math.log10(10 ** (x.firstDecibels / 10) + 10 ** (x.secondDecibels / 10));
  if (!Number.isFinite(combinedDecibels))
    simpleError(
      "combinedDecibels",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    combinedDecibels: Object.is(combinedDecibels, -0) ? 0 : combinedDecibels,
  };
};

export const example = {
  input: {
    firstDecibels: 60,
    secondDecibels: 60,
  },
  output: { combinedDecibels: 63.01029995663981 },
} satisfies ToolExample<DbAdditionTwoSourcesInput, DbAdditionTwoSourcesOutput>;

export const tool = createSimpleTool({
  id: "acoustics/db-addition-two-sources",
  title: "Db Addition Two Sources",
  description: "Energetic sum of two uncorrelated sound levels in decibels.",
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
    {
      id: "combinedDecibels",
      kind: "number",
      label: "Combined Decibels",
      unit: "dB",
    },
  ],
  calculate: (input) =>
    calculateDbAdditionTwoSources({
      firstDecibels: input.firstDecibels as number,
      secondDecibels: input.secondDecibels as number,
    }),
});
export const dbAdditionTwoSourcesTool = tool;
export const runDbAdditionTwoSources = tool.execute;
export default tool;
