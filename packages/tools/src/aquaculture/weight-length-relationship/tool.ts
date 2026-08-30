import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type WeightLengthRelationshipInput = Readonly<{
  readonly coefficientA: number;
  readonly lengthCentimeters: number;
  readonly exponentB: number;
}>;
export type WeightLengthRelationshipOutput = Readonly<{
  readonly predictedWeightGrams: number;
}>;

export const calculateWeightLengthRelationship = (
  x: WeightLengthRelationshipInput,
): WeightLengthRelationshipOutput => {
  if (!Number.isFinite(x.coefficientA) || x.coefficientA < 0)
    simpleError("coefficientA", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.lengthCentimeters) || x.lengthCentimeters < 0)
    simpleError("lengthCentimeters", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.exponentB) || x.exponentB < 0)
    simpleError("exponentB", "Provide a finite nonnegative number.");
  if (x.coefficientA <= 0 || x.lengthCentimeters <= 0 || x.exponentB <= 0)
    simpleError(
      "coefficientA",
      "Coefficient, length, and exponent must be positive.",
    );
  const predictedWeightGrams =
    x.coefficientA * x.lengthCentimeters ** x.exponentB;
  if (!Number.isFinite(predictedWeightGrams))
    simpleError(
      "predictedWeightGrams",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    predictedWeightGrams: Object.is(predictedWeightGrams, -0)
      ? 0
      : predictedWeightGrams,
  };
};

export const example = {
  input: {
    coefficientA: 0.01,
    lengthCentimeters: 20,
    exponentB: 3,
  },
  output: { predictedWeightGrams: 80 },
} satisfies ToolExample<
  WeightLengthRelationshipInput,
  WeightLengthRelationshipOutput
>;

export const tool = createSimpleTool({
  id: "aquaculture/weight-length-relationship",
  title: "Weight Length Relationship",
  description:
    "Evaluate W = aL^b using user-supplied empirical coefficients and length in centimetres.",
  inputs: [
    {
      id: "coefficientA",
      kind: "number",
      label: "Coefficient A",
      unit: "g/cm^b",
    },
    {
      id: "lengthCentimeters",
      kind: "number",
      label: "Length Centimeters",
      unit: "cm",
    },
    { id: "exponentB", kind: "number", label: "Exponent B", unit: "ratio" },
  ],
  outputs: [
    {
      id: "predictedWeightGrams",
      kind: "number",
      label: "Predicted Weight Grams",
      unit: "g",
    },
  ],
  calculate: (input) =>
    calculateWeightLengthRelationship({
      coefficientA: input.coefficientA as number,
      lengthCentimeters: input.lengthCentimeters as number,
      exponentB: input.exponentB as number,
    }),
});
export const runWeightLengthRelationship = tool.execute;
export default tool;
