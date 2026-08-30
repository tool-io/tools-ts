import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
} from "../shared.js";
export type Input = Readonly<{
  readonly lotNetReceivedKg: number;
  readonly sampleReceivedMassesGrams: readonly number[];
  readonly sampleDryMassesGrams: readonly number[];
  readonly agreedCommercialRegainFraction: number;
}>;
export type Output = Readonly<{
  readonly samplePooledRegainFraction: number;
  readonly estimatedLotDryKg: number;
  readonly commercialConditionedKg: number;
  readonly conditioningWeightAdjustmentKg: number;
}>;
const inputFields = [
  { id: "lotNetReceivedKg", label: "Lot net received kg", kind: "number" },
  {
    id: "sampleReceivedMassesGrams",
    label: "Sample received masses grams",
    kind: "numberList",
  },
  {
    id: "sampleDryMassesGrams",
    label: "Sample dry masses grams",
    kind: "numberList",
  },
  {
    id: "agreedCommercialRegainFraction",
    label: "Agreed commercial regain fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.sampleReceivedMassesGrams.forEach((v) =>
    positive(v, "sampleReceivedMassesGrams"),
  );
  input.sampleDryMassesGrams.forEach((v) =>
    positive(v, "sampleDryMassesGrams"),
  );
  nonnegative(input.lotNetReceivedKg, "lotNetReceivedKg");
  nonnegative(
    input.agreedCommercialRegainFraction,
    "agreedCommercialRegainFraction",
  );
  aligned(
    input.sampleReceivedMassesGrams,
    input.sampleDryMassesGrams,
    "sampleReceivedMassesGrams",
  );
  if (
    input.sampleDryMassesGrams.some(
      (v, i) => v > input.sampleReceivedMassesGrams[i],
    )
  )
    simpleError(
      "sampleDryMassesGrams",
      "Dry sample mass cannot exceed received sample mass.",
    );
  const wet = input.sampleReceivedMassesGrams.reduce((a, b) => a + b, 0),
    dry = input.sampleDryMassesGrams.reduce((a, b) => a + b, 0),
    estimatedLotDryKg = (input.lotNetReceivedKg * dry) / wet,
    commercialConditionedKg =
      estimatedLotDryKg * (1 + input.agreedCommercialRegainFraction);
  return {
    samplePooledRegainFraction: wet / dry - 1,
    estimatedLotDryKg,
    commercialConditionedKg,
    conditioningWeightAdjustmentKg:
      commercialConditionedKg - input.lotNetReceivedKg,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  lotNetReceivedKg: 110,
  sampleReceivedMassesGrams: [110, 240],
  sampleDryMassesGrams: [100, 200],
  agreedCommercialRegainFraction: 0.11,
} satisfies Input;
export const exampleOutput = {
  samplePooledRegainFraction: 0.16666666666666666,
  estimatedLotDryKg: 94.28571428571429,
  commercialConditionedKg: 104.65714285714286,
  conditioningWeightAdjustmentKg: -5.342857142857142,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sericulture/conditioned-weight-international-formula",
  title: "Conditioned Weight International Formula",
  description:
    "Estimate lot commercial conditioned weight using pooled sample dry/received ratios and an explicit agreed dry-basis regain; no jurisdiction-specific conditioning allowance is embedded.",
  inputs: inputFields,
  outputs: [
    {
      id: "samplePooledRegainFraction",
      label: "Sample pooled regain fraction",
      kind: "number",
    },
    { id: "estimatedLotDryKg", label: "Estimated lot dry kg", kind: "number" },
    {
      id: "commercialConditionedKg",
      label: "Commercial conditioned kg",
      kind: "number",
    },
    {
      id: "conditioningWeightAdjustmentKg",
      label: "Conditioning weight adjustment kg",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      lotNetReceivedKg: value.lotNetReceivedKg as number,
      sampleReceivedMassesGrams:
        value.sampleReceivedMassesGrams as readonly number[],
      sampleDryMassesGrams: value.sampleDryMassesGrams as readonly number[],
      agreedCommercialRegainFraction:
        value.agreedCommercialRegainFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
