import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TroyOunceToGramsConverterInput = Readonly<{
  readonly troyOunces: number;
}>;
export type TroyOunceToGramsConverterOutput = Readonly<{
  readonly grams: number;
}>;

export const calculateTroyOunceToGramsConverter = (
  x: TroyOunceToGramsConverterInput,
): TroyOunceToGramsConverterOutput => {
  if (!Number.isFinite(x.troyOunces) || x.troyOunces < 0)
    simpleError("troyOunces", "Provide a finite nonnegative number.");
  const grams = x.troyOunces * 31.1034768;
  if (!Number.isFinite(grams))
    simpleError("grams", "Inputs produce an undefined or out-of-range result.");
  return { grams: Object.is(grams, -0) ? 0 : grams };
};

export const example = {
  input: {
    troyOunces: 2,
  },
  output: { grams: 62.2069536 },
} satisfies ToolExample<
  TroyOunceToGramsConverterInput,
  TroyOunceToGramsConverterOutput
>;

export const tool = createSimpleTool({
  id: "numismatics/troy-ounce-to-grams-converter",
  title: "Troy Ounce To Grams Converter",
  description:
    "Convert troy ounces to grams using the NIST precious-metal conversion factor; do not confuse troy ounces with avoirdupois ounces.",
  inputs: [
    { id: "troyOunces", kind: "number", label: "Troy Ounces", unit: "oz t" },
  ],
  outputs: [{ id: "grams", kind: "number", label: "Grams", unit: "g" }],
  calculate: (input) =>
    calculateTroyOunceToGramsConverter({
      troyOunces: input.troyOunces as number,
    }),
});
export const runTroyOunceToGramsConverter = tool.execute;
export default tool;
