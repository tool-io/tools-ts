import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DbSubtractBackgroundInput = Readonly<{
  readonly totalDecibels: number;
  readonly backgroundDecibels: number;
}>;
export type DbSubtractBackgroundOutput = Readonly<{
  readonly sourceDecibels: number;
}>;

export const calculateDbSubtractBackground = (
  x: DbSubtractBackgroundInput,
): DbSubtractBackgroundOutput => {
  if (!Number.isFinite(x.totalDecibels))
    simpleError("totalDecibels", "Provide a finite number.");
  if (!Number.isFinite(x.backgroundDecibels))
    simpleError("backgroundDecibels", "Provide a finite number.");
  if (!(x.totalDecibels > x.backgroundDecibels))
    simpleError("input", "Inputs violate the stated model or operating range.");
  const sourceDecibels =
    10 *
    Math.log10(
      10 ** (x.totalDecibels / 10) - 10 ** (x.backgroundDecibels / 10),
    );
  if (!Number.isFinite(sourceDecibels))
    simpleError(
      "sourceDecibels",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { sourceDecibels: Object.is(sourceDecibels, -0) ? 0 : sourceDecibels };
};

export const example = {
  input: {
    totalDecibels: 70,
    backgroundDecibels: 60,
  },
  output: { sourceDecibels: 69.54242509439325 },
} satisfies ToolExample<DbSubtractBackgroundInput, DbSubtractBackgroundOutput>;

export const tool = createSimpleTool({
  id: "acoustics/db-subtract-background",
  title: "Db Subtract Background",
  description:
    "Source-only sound level after energetic subtraction of measured background from total level.",
  inputs: [
    {
      id: "totalDecibels",
      kind: "number",
      label: "Total Decibels",
      unit: "dB",
    },
    {
      id: "backgroundDecibels",
      kind: "number",
      label: "Background Decibels",
      unit: "dB",
    },
  ],
  outputs: [
    {
      id: "sourceDecibels",
      kind: "number",
      label: "Source Decibels",
      unit: "dB",
    },
  ],
  calculate: (input) =>
    calculateDbSubtractBackground({
      totalDecibels: input.totalDecibels as number,
      backgroundDecibels: input.backgroundDecibels as number,
    }),
});
export const dbSubtractBackgroundTool = tool;
export const runDbSubtractBackground = tool.execute;
export default tool;
