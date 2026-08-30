import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DressingPercentageInput = Readonly<{
  readonly dressedWeightKilograms: number;
  readonly wholeWeightKilograms: number;
}>;
export type DressingPercentageOutput = Readonly<{
  readonly dressingPercent: number;
}>;

export const calculateDressingPercentage = (
  x: DressingPercentageInput,
): DressingPercentageOutput => {
  if (
    !Number.isFinite(x.dressedWeightKilograms) ||
    x.dressedWeightKilograms < 0
  )
    simpleError(
      "dressedWeightKilograms",
      "Provide a finite nonnegative number.",
    );
  if (!Number.isFinite(x.wholeWeightKilograms) || x.wholeWeightKilograms <= 0)
    simpleError("wholeWeightKilograms", "Provide a finite positive number.");
  if (x.dressedWeightKilograms > x.wholeWeightKilograms)
    simpleError(
      "dressedWeightKilograms",
      "Dressed mass cannot exceed whole mass.",
    );
  const dressingPercent =
    (x.dressedWeightKilograms / x.wholeWeightKilograms) * 100;
  if (!Number.isFinite(dressingPercent))
    simpleError(
      "dressingPercent",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    dressingPercent: Object.is(dressingPercent, -0) ? 0 : dressingPercent,
  };
};

export const example = {
  input: {
    dressedWeightKilograms: 7,
    wholeWeightKilograms: 10,
  },
  output: { dressingPercent: 70 },
} satisfies ToolExample<DressingPercentageInput, DressingPercentageOutput>;

export const tool = createSimpleTool({
  id: "aquaculture/dressing-percentage",
  title: "Dressing Percentage",
  description:
    "Calculate dressed yield as a fraction of whole-fish mass under a consistent processing definition.",
  inputs: [
    {
      id: "dressedWeightKilograms",
      kind: "number",
      label: "Dressed Weight Kilograms",
      unit: "kg",
    },
    {
      id: "wholeWeightKilograms",
      kind: "number",
      label: "Whole Weight Kilograms",
      unit: "kg",
    },
  ],
  outputs: [
    {
      id: "dressingPercent",
      kind: "number",
      label: "Dressing Percent",
      unit: "%",
    },
  ],
  calculate: (input) =>
    calculateDressingPercentage({
      dressedWeightKilograms: input.dressedWeightKilograms as number,
      wholeWeightKilograms: input.wholeWeightKilograms as number,
    }),
});
export const runDressingPercentage = tool.execute;
export default tool;
