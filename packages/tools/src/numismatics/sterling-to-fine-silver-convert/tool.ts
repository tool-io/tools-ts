import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SterlingToFineSilverConvertInput = Readonly<{
  readonly sterlingMassGrams: number;
}>;
export type SterlingToFineSilverConvertOutput = Readonly<{
  readonly fineSilverGrams: number;
}>;

export const calculateSterlingToFineSilverConvert = (
  x: SterlingToFineSilverConvertInput,
): SterlingToFineSilverConvertOutput => {
  if (!Number.isFinite(x.sterlingMassGrams) || x.sterlingMassGrams < 0)
    simpleError("sterlingMassGrams", "Provide a finite nonnegative number.");
  const fineSilverGrams = x.sterlingMassGrams * 0.925;
  if (!Number.isFinite(fineSilverGrams))
    simpleError(
      "fineSilverGrams",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    fineSilverGrams: Object.is(fineSilverGrams, -0) ? 0 : fineSilverGrams,
  };
};

export const example = {
  input: {
    sterlingMassGrams: 100,
  },
  output: { fineSilverGrams: 92.5 },
} satisfies ToolExample<
  SterlingToFineSilverConvertInput,
  SterlingToFineSilverConvertOutput
>;

export const tool = createSimpleTool({
  id: "numismatics/sterling-to-fine-silver-convert",
  title: "Sterling To Fine Silver Convert",
  description:
    "Convert gross sterling-silver mass to fine silver at 925/1000 fineness.",
  inputs: [
    {
      id: "sterlingMassGrams",
      kind: "number",
      label: "Sterling Mass Grams",
      unit: "g",
    },
  ],
  outputs: [
    {
      id: "fineSilverGrams",
      kind: "number",
      label: "Fine Silver Grams",
      unit: "g",
    },
  ],
  calculate: (input) =>
    calculateSterlingToFineSilverConvert({
      sterlingMassGrams: input.sterlingMassGrams as number,
    }),
});
export const runSterlingToFineSilverConvert = tool.execute;
export default tool;
