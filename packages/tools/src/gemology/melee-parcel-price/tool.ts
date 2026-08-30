import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  count,
  aligned,
} from "../shared.js";
export type Input = Readonly<{
  readonly parcelClassStoneCounts: readonly number[];
  readonly meanClassCaratMasses: readonly number[];
  readonly classQuotedRatesPerCarat: readonly number[];
}>;
export type Output = Readonly<{
  readonly totalParcelCarats: number;
  readonly totalParcelQuote: number;
  readonly caratWeightedMeanQuotedRate: number;
}>;
const inputFields = [
  {
    id: "parcelClassStoneCounts",
    label: "Parcel class stone counts",
    kind: "numberList",
  },
  {
    id: "meanClassCaratMasses",
    label: "Mean class carat masses",
    kind: "numberList",
  },
  {
    id: "classQuotedRatesPerCarat",
    label: "Class quoted rates per carat",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.meanClassCaratMasses.forEach((v) =>
    nonnegative(v, "meanClassCaratMasses"),
  );
  input.classQuotedRatesPerCarat.forEach((v) =>
    nonnegative(v, "classQuotedRatesPerCarat"),
  );
  input.parcelClassStoneCounts.forEach((v) =>
    count(v, "parcelClassStoneCounts"),
  );
  aligned(
    input.parcelClassStoneCounts,
    input.meanClassCaratMasses,
    "parcelClassStoneCounts",
  );
  aligned(
    input.parcelClassStoneCounts,
    input.classQuotedRatesPerCarat,
    "parcelClassStoneCounts",
  );
  const masses = input.parcelClassStoneCounts.map(
      (n, i) => n * input.meanClassCaratMasses[i],
    ),
    totalParcelCarats = positive(
      masses.reduce((a, b) => a + b, 0),
      "parcelMass",
    ),
    totalParcelQuote = masses.reduce(
      (s, v, i) => s + v * input.classQuotedRatesPerCarat[i],
      0,
    );
  return {
    totalParcelCarats,
    totalParcelQuote,
    caratWeightedMeanQuotedRate: totalParcelQuote / totalParcelCarats,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  parcelClassStoneCounts: [10, 20],
  meanClassCaratMasses: [0.01, 0.02],
  classQuotedRatesPerCarat: [100, 200],
} satisfies Input;
export const exampleOutput = {
  totalParcelCarats: 0.5,
  totalParcelQuote: 90,
  caratWeightedMeanQuotedRate: 180,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "gemology/melee-parcel-price",
  title: "Melee Parcel Price",
  description:
    "Account heterogeneous measured/quoted melee inventory by class counts and mean masses, correctly weighting per-carat rate by carat exposure not stone count; no inferred quality/market value.",
  inputs: inputFields,
  outputs: [
    { id: "totalParcelCarats", label: "Total parcel carats", kind: "number" },
    { id: "totalParcelQuote", label: "Total parcel quote", kind: "number" },
    {
      id: "caratWeightedMeanQuotedRate",
      label: "Carat weighted mean quoted rate",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      parcelClassStoneCounts: value.parcelClassStoneCounts as readonly number[],
      meanClassCaratMasses: value.meanClassCaratMasses as readonly number[],
      classQuotedRatesPerCarat:
        value.classQuotedRatesPerCarat as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
