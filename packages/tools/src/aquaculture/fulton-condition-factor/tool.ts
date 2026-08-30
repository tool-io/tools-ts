import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FultonConditionFactorInput = Readonly<{
  readonly weightGrams: number;
  readonly lengthCentimeters: number;
}>;
export type FultonConditionFactorOutput = Readonly<{
  readonly fultonConditionFactor: number;
}>;

export const calculateFultonConditionFactor = (
  x: FultonConditionFactorInput,
): FultonConditionFactorOutput => {
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
} satisfies ToolExample<
  FultonConditionFactorInput,
  FultonConditionFactorOutput
>;

export const tool = createSimpleTool({
  id: "aquaculture/fulton-condition-factor",
  title: "Fulton Condition Factor",
  description:
    "Calculate the conventional Fulton condition factor from grams and centimetres.",
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
    calculateFultonConditionFactor({
      weightGrams: input.weightGrams as number,
      lengthCentimeters: input.lengthCentimeters as number,
    }),
});
export const runFultonConditionFactor = tool.execute;
export default tool;
