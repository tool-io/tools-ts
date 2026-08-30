import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FilletYieldInput = Readonly<{
  readonly filletWeightKilograms: number;
  readonly wholeWeightKilograms: number;
}>;
export type FilletYieldOutput = Readonly<{
  readonly filletYieldPercent: number;
}>;

export const calculateFilletYield = (
  x: FilletYieldInput,
): FilletYieldOutput => {
  if (!Number.isFinite(x.filletWeightKilograms) || x.filletWeightKilograms < 0)
    simpleError(
      "filletWeightKilograms",
      "Provide a finite nonnegative number.",
    );
  if (!Number.isFinite(x.wholeWeightKilograms) || x.wholeWeightKilograms <= 0)
    simpleError("wholeWeightKilograms", "Provide a finite positive number.");
  if (x.filletWeightKilograms > x.wholeWeightKilograms)
    simpleError(
      "filletWeightKilograms",
      "Fillet mass cannot exceed whole mass.",
    );
  const filletYieldPercent =
    (x.filletWeightKilograms / x.wholeWeightKilograms) * 100;
  if (!Number.isFinite(filletYieldPercent))
    simpleError(
      "filletYieldPercent",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    filletYieldPercent: Object.is(filletYieldPercent, -0)
      ? 0
      : filletYieldPercent,
  };
};

export const example = {
  input: {
    filletWeightKilograms: 4,
    wholeWeightKilograms: 10,
  },
  output: { filletYieldPercent: 40 },
} satisfies ToolExample<FilletYieldInput, FilletYieldOutput>;

export const tool = createSimpleTool({
  id: "aquaculture/fillet-yield",
  title: "Fillet Yield",
  description:
    "Calculate recovered fillet mass as a percentage of whole-fish mass.",
  inputs: [
    {
      id: "filletWeightKilograms",
      kind: "number",
      label: "Fillet Weight Kilograms",
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
      id: "filletYieldPercent",
      kind: "number",
      label: "Fillet Yield Percent",
      unit: "%",
    },
  ],
  calculate: (input) =>
    calculateFilletYield({
      filletWeightKilograms: input.filletWeightKilograms as number,
      wholeWeightKilograms: input.wholeWeightKilograms as number,
    }),
});
export const runFilletYield = tool.execute;
export default tool;
