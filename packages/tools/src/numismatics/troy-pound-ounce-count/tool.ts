import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TroyPoundOunceCountInput = Readonly<{
  readonly troyPounds: number;
}>;
export type TroyPoundOunceCountOutput = Readonly<{
  readonly troyOunces: number;
}>;

export const calculateTroyPoundOunceCount = (
  x: TroyPoundOunceCountInput,
): TroyPoundOunceCountOutput => {
  if (!Number.isFinite(x.troyPounds) || x.troyPounds < 0)
    simpleError("troyPounds", "Provide a finite nonnegative number.");
  const troyOunces = x.troyPounds * 12;
  if (!Number.isFinite(troyOunces))
    simpleError(
      "troyOunces",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { troyOunces: Object.is(troyOunces, -0) ? 0 : troyOunces };
};

export const example = {
  input: {
    troyPounds: 2,
  },
  output: { troyOunces: 24 },
} satisfies ToolExample<TroyPoundOunceCountInput, TroyPoundOunceCountOutput>;

export const tool = createSimpleTool({
  id: "numismatics/troy-pound-ounce-count",
  title: "Troy Pound Ounce Count",
  description:
    "Convert troy pounds to troy ounces; a troy pound has twelve troy ounces.",
  inputs: [
    { id: "troyPounds", kind: "number", label: "Troy Pounds", unit: "lb t" },
  ],
  outputs: [
    { id: "troyOunces", kind: "number", label: "Troy Ounces", unit: "oz t" },
  ],
  calculate: (input) =>
    calculateTroyPoundOunceCount({
      troyPounds: input.troyPounds as number,
    }),
});
export const runTroyPoundOunceCount = tool.execute;
export default tool;
