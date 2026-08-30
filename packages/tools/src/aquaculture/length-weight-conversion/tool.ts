import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LengthWeightConversionInput = Readonly<{
  readonly weightGrams: number;
  readonly coefficientA: number;
  readonly exponentB: number;
}>;
export type LengthWeightConversionOutput = Readonly<{
  readonly predictedLengthCentimeters: number;
}>;

export const calculateLengthWeightConversion = (
  x: LengthWeightConversionInput,
): LengthWeightConversionOutput => {
  if (!Number.isFinite(x.weightGrams) || x.weightGrams < 0)
    simpleError("weightGrams", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.coefficientA) || x.coefficientA < 0)
    simpleError("coefficientA", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.exponentB) || x.exponentB < 0)
    simpleError("exponentB", "Provide a finite nonnegative number.");
  if (x.weightGrams <= 0 || x.coefficientA <= 0 || x.exponentB <= 0)
    simpleError(
      "coefficientA",
      "Weight, coefficient, and exponent must be positive.",
    );
  const predictedLengthCentimeters =
    (x.weightGrams / x.coefficientA) ** (1 / x.exponentB);
  if (!Number.isFinite(predictedLengthCentimeters))
    simpleError(
      "predictedLengthCentimeters",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    predictedLengthCentimeters: Object.is(predictedLengthCentimeters, -0)
      ? 0
      : predictedLengthCentimeters,
  };
};

export const example = {
  input: {
    weightGrams: 80,
    coefficientA: 0.01,
    exponentB: 3,
  },
  output: { predictedLengthCentimeters: 19.999999999999996 },
} satisfies ToolExample<
  LengthWeightConversionInput,
  LengthWeightConversionOutput
>;

export const tool = createSimpleTool({
  id: "aquaculture/length-weight-conversion",
  title: "Length Weight Conversion",
  description:
    "Invert a user-supplied weight-length relationship to estimate length; use coefficients fitted to the same species and length units.",
  inputs: [
    { id: "weightGrams", kind: "number", label: "Weight Grams", unit: "g" },
    {
      id: "coefficientA",
      kind: "number",
      label: "Coefficient A",
      unit: "g/cm^b",
    },
    { id: "exponentB", kind: "number", label: "Exponent B", unit: "ratio" },
  ],
  outputs: [
    {
      id: "predictedLengthCentimeters",
      kind: "number",
      label: "Predicted Length Centimeters",
      unit: "cm",
    },
  ],
  calculate: (input) =>
    calculateLengthWeightConversion({
      weightGrams: input.weightGrams as number,
      coefficientA: input.coefficientA as number,
      exponentB: input.exponentB as number,
    }),
});
export const runLengthWeightConversion = tool.execute;
export default tool;
