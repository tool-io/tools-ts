import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ConditionFactorInput = Readonly<{
  readonly weightGrams: number;
  readonly lengthCentimeters: number;
}>;
export type ConditionFactorOutput = Readonly<{
  readonly fultonConditionFactor: number;
}>;

export const calculateConditionFactor = (
  x: ConditionFactorInput,
): ConditionFactorOutput => {
  if (!Number.isFinite(x.weightGrams) || x.weightGrams < 0)
    simpleError("weightGrams", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.lengthCentimeters) || x.lengthCentimeters <= 0)
    simpleError("lengthCentimeters", "Provide a finite positive number.");
  const fultonConditionFactor =
    (100 * x.weightGrams) / x.lengthCentimeters ** 3;
  if (!Number.isFinite(fultonConditionFactor))
    simpleError(
      "fultonConditionFactor",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    fultonConditionFactor: Object.is(fultonConditionFactor, -0)
      ? 0
      : fultonConditionFactor,
  };
};

export const example = {
  input: {
    weightGrams: 100,
    lengthCentimeters: 20,
  },
  output: { fultonConditionFactor: 1.25 },
} satisfies ToolExample<ConditionFactorInput, ConditionFactorOutput>;

export const tool = createSimpleTool({
  id: "aquaculture/condition-factor",
  title: "Condition Factor",
  description:
    "Calculate Fulton's mass-length condition factor for weight in grams and length in centimetres; body shape varies by species.",
  inputs: [
    { id: "weightGrams", kind: "number", label: "Weight Grams", unit: "g" },
    {
      id: "lengthCentimeters",
      kind: "number",
      label: "Length Centimeters",
      unit: "cm",
    },
  ],
  outputs: [
    {
      id: "fultonConditionFactor",
      kind: "number",
      label: "Fulton Condition Factor",
      unit: "index",
    },
  ],
  calculate: (input) =>
    calculateConditionFactor({
      weightGrams: input.weightGrams as number,
      lengthCentimeters: input.lengthCentimeters as number,
    }),
});
export const runConditionFactor = tool.execute;
export default tool;
