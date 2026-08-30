import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type GramsToTroyOuncesConverterInput = Readonly<{
  readonly grams: number;
}>;
export type GramsToTroyOuncesConverterOutput = Readonly<{
  readonly troyOunces: number;
}>;

export const calculateGramsToTroyOuncesConverter = (
  x: GramsToTroyOuncesConverterInput,
): GramsToTroyOuncesConverterOutput => {
  if (!Number.isFinite(x.grams) || x.grams < 0)
    simpleError("grams", "Provide a finite nonnegative number.");
  const troyOunces = x.grams / 31.1034768;
  if (!Number.isFinite(troyOunces))
    simpleError(
      "troyOunces",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { troyOunces: Object.is(troyOunces, -0) ? 0 : troyOunces };
};

export const example = {
  input: {
    grams: 62.2069536,
  },
  output: { troyOunces: 2 },
} satisfies ToolExample<
  GramsToTroyOuncesConverterInput,
  GramsToTroyOuncesConverterOutput
>;

export const tool = createSimpleTool({
  id: "numismatics/grams-to-troy-ounces-converter",
  title: "Grams To Troy Ounces Converter",
  description:
    "Convert a measured precious-metal mass in grams to troy ounces.",
  inputs: [{ id: "grams", kind: "number", label: "Grams", unit: "g" }],
  outputs: [
    { id: "troyOunces", kind: "number", label: "Troy Ounces", unit: "oz t" },
  ],
  calculate: (input) =>
    calculateGramsToTroyOuncesConverter({
      grams: input.grams as number,
    }),
});
export const runGramsToTroyOuncesConverter = tool.execute;
export default tool;
