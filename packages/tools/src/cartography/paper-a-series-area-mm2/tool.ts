import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PaperASeriesAreaMm2Input = Readonly<{
  readonly aNumber: number;
}>;
export type PaperASeriesAreaMm2Output = Readonly<{
  readonly areaSquareMillimeters: number;
}>;

export const calculatePaperASeriesAreaMm2 = (
  x: PaperASeriesAreaMm2Input,
): PaperASeriesAreaMm2Output => {
  if (!Number.isFinite(x.aNumber) || x.aNumber < 0)
    simpleError("aNumber", "Provide a finite nonnegative number.");
  if (!(Number.isInteger(x.aNumber) && x.aNumber <= 10))
    simpleError("input", "Inputs violate the stated model or operating range.");
  const areaSquareMillimeters = [
    841 * 1189,
    594 * 841,
    420 * 594,
    297 * 420,
    210 * 297,
    148 * 210,
    105 * 148,
    74 * 105,
    52 * 74,
    37 * 52,
    26 * 37,
  ][x.aNumber];
  if (!Number.isFinite(areaSquareMillimeters))
    simpleError(
      "areaSquareMillimeters",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    areaSquareMillimeters: Object.is(areaSquareMillimeters, -0)
      ? 0
      : areaSquareMillimeters,
  };
};

export const example = {
  input: {
    aNumber: 4,
  },
  output: { areaSquareMillimeters: 62370 },
} satisfies ToolExample<PaperASeriesAreaMm2Input, PaperASeriesAreaMm2Output>;

export const tool = createSimpleTool({
  id: "cartography/paper-a-series-area-mm2",
  title: "Paper A Series Area Mm2",
  description:
    "ISO A-series nominal sheet area in square millimetres from the conventional rounded dimensions A0–A10.",
  inputs: [{ id: "aNumber", kind: "number", label: "A Number", minimum: 0 }],
  outputs: [
    {
      id: "areaSquareMillimeters",
      kind: "number",
      label: "Area Square Millimeters",
      unit: "mm2",
    },
  ],
  calculate: (input) =>
    calculatePaperASeriesAreaMm2({
      aNumber: input.aNumber as number,
    }),
});
export const paperASeriesAreaMm2Tool = tool;
export const runPaperASeriesAreaMm2 = tool.execute;
export default tool;
