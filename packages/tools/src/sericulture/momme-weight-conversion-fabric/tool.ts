import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly swatchMassGrams: number;
  readonly swatchWidthCm: number;
  readonly swatchLengthCm: number;
  readonly measuredMoistureRegainFraction: number;
  readonly agreedMoistureRegainFraction: number;
}>;
export type Output = Readonly<{
  readonly measuredFabricGsm: number;
  readonly conditionedFabricGsm: number;
  readonly conditionedMomme: number;
}>;
const inputFields = [
  { id: "swatchMassGrams", label: "Swatch mass grams", kind: "number" },
  { id: "swatchWidthCm", label: "Swatch width cm", kind: "number" },
  { id: "swatchLengthCm", label: "Swatch length cm", kind: "number" },
  {
    id: "measuredMoistureRegainFraction",
    label: "Measured moisture regain fraction",
    kind: "number",
  },
  {
    id: "agreedMoistureRegainFraction",
    label: "Agreed moisture regain fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.swatchWidthCm, "swatchWidthCm");
  positive(input.swatchLengthCm, "swatchLengthCm");
  nonnegative(input.swatchMassGrams, "swatchMassGrams");
  nonnegative(
    input.measuredMoistureRegainFraction,
    "measuredMoistureRegainFraction",
  );
  nonnegative(
    input.agreedMoistureRegainFraction,
    "agreedMoistureRegainFraction",
  );
  const measuredFabricGsm =
      input.swatchMassGrams /
      ((input.swatchWidthCm * input.swatchLengthCm) / 10000),
    conditionedFabricGsm =
      (measuredFabricGsm / (1 + input.measuredMoistureRegainFraction)) *
      (1 + input.agreedMoistureRegainFraction);
  return {
    measuredFabricGsm,
    conditionedFabricGsm,
    conditionedMomme: conditionedFabricGsm / (453.59237 / (1.143 * 91.44)),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  swatchMassGrams: 4.339935676784934,
  swatchWidthCm: 10,
  swatchLengthCm: 10,
  measuredMoistureRegainFraction: 0,
  agreedMoistureRegainFraction: 0,
} satisfies Input;
export const exampleOutput = {
  measuredFabricGsm: 433.99356767849343,
  conditionedFabricGsm: 433.99356767849343,
  conditionedMomme: 100,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sericulture/momme-weight-conversion-fabric",
  title: "Momme Weight Conversion Fabric",
  description:
    "Convert measured swatch GSM to moisture-conditioned commercial momme: one pound per 45-inch by 100-yard silk piece, approximately 4.34 g/m² per momme; regain is dry-basis, not wet-basis water percent.",
  inputs: inputFields,
  outputs: [
    { id: "measuredFabricGsm", label: "Measured fabric gsm", kind: "number" },
    {
      id: "conditionedFabricGsm",
      label: "Conditioned fabric gsm",
      kind: "number",
    },
    { id: "conditionedMomme", label: "Conditioned momme", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      swatchMassGrams: value.swatchMassGrams as number,
      swatchWidthCm: value.swatchWidthCm as number,
      swatchLengthCm: value.swatchLengthCm as number,
      measuredMoistureRegainFraction:
        value.measuredMoistureRegainFraction as number,
      agreedMoistureRegainFraction:
        value.agreedMoistureRegainFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
