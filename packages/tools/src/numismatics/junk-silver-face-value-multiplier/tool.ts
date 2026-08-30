import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type JunkSilverFaceValueMultiplierInput = Readonly<{
  readonly faceValueDollars: number;
  readonly troyOuncesPerFaceDollar: number;
}>;
export type JunkSilverFaceValueMultiplierOutput = Readonly<{
  readonly fineSilverTroyOunces: number;
}>;

export const calculateJunkSilverFaceValueMultiplier = (
  x: JunkSilverFaceValueMultiplierInput,
): JunkSilverFaceValueMultiplierOutput => {
  if (!Number.isFinite(x.faceValueDollars) || x.faceValueDollars < 0)
    simpleError("faceValueDollars", "Provide a finite nonnegative number.");
  if (
    !Number.isFinite(x.troyOuncesPerFaceDollar) ||
    x.troyOuncesPerFaceDollar < 0
  )
    simpleError(
      "troyOuncesPerFaceDollar",
      "Provide a finite nonnegative number.",
    );
  const fineSilverTroyOunces = x.faceValueDollars * x.troyOuncesPerFaceDollar;
  if (!Number.isFinite(fineSilverTroyOunces))
    simpleError(
      "fineSilverTroyOunces",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    fineSilverTroyOunces: Object.is(fineSilverTroyOunces, -0)
      ? 0
      : fineSilverTroyOunces,
  };
};

export const example = {
  input: {
    faceValueDollars: 10,
    troyOuncesPerFaceDollar: 0.715,
  },
  output: { fineSilverTroyOunces: 7.1499999999999995 },
} satisfies ToolExample<
  JunkSilverFaceValueMultiplierInput,
  JunkSilverFaceValueMultiplierOutput
>;

export const tool = createSimpleTool({
  id: "numismatics/junk-silver-face-value-multiplier",
  title: "Junk Silver Face Value Multiplier",
  description:
    "Estimate fine silver from face value with an explicitly supplied troy-ounces-per-dollar factor; wear changes the factor.",
  inputs: [
    {
      id: "faceValueDollars",
      kind: "number",
      label: "Face Value Dollars",
      unit: "currency",
    },
    {
      id: "troyOuncesPerFaceDollar",
      kind: "number",
      label: "Troy Ounces Per Face Dollar",
      unit: "oz t/currency",
    },
  ],
  outputs: [
    {
      id: "fineSilverTroyOunces",
      kind: "number",
      label: "Fine Silver Troy Ounces",
      unit: "oz t",
    },
  ],
  calculate: (input) =>
    calculateJunkSilverFaceValueMultiplier({
      faceValueDollars: input.faceValueDollars as number,
      troyOuncesPerFaceDollar: input.troyOuncesPerFaceDollar as number,
    }),
});
export const runJunkSilverFaceValueMultiplier = tool.execute;
export default tool;
