import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PennyweightToGramsConverterInput = Readonly<{
  readonly pennyweights: number;
}>;
export type PennyweightToGramsConverterOutput = Readonly<{
  readonly grams: number;
}>;

export const calculatePennyweightToGramsConverter = (
  x: PennyweightToGramsConverterInput,
): PennyweightToGramsConverterOutput => {
  if (!Number.isFinite(x.pennyweights) || x.pennyweights < 0)
    simpleError("pennyweights", "Provide a finite nonnegative number.");
  const grams = (x.pennyweights * 31.1034768) / 20;
  if (!Number.isFinite(grams))
    simpleError("grams", "Inputs produce an undefined or out-of-range result.");
  return { grams: Object.is(grams, -0) ? 0 : grams };
};

export const example = {
  input: {
    pennyweights: 20,
  },
  output: { grams: 31.1034768 },
} satisfies ToolExample<
  PennyweightToGramsConverterInput,
  PennyweightToGramsConverterOutput
>;

export const tool = createSimpleTool({
  id: "numismatics/pennyweight-to-grams-converter",
  title: "Pennyweight To Grams Converter",
  description:
    "Convert pennyweights to grams; twenty pennyweights make one troy ounce.",
  inputs: [
    { id: "pennyweights", kind: "number", label: "Pennyweights", unit: "dwt" },
  ],
  outputs: [{ id: "grams", kind: "number", label: "Grams", unit: "g" }],
  calculate: (input) =>
    calculatePennyweightToGramsConverter({
      pennyweights: input.pennyweights as number,
    }),
});
export const runPennyweightToGramsConverter = tool.execute;
export default tool;
