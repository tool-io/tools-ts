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
  fraction,
  count,
  aligned,
} from "../shared.js";
export type Input = Readonly<{
  readonly inspectedLarvaeByCohort: readonly number[];
  readonly parasitizedLarvaeByCohort: readonly number[];
  readonly lostCocoonFractionsAmongParasitized: readonly number[];
  readonly expectedCocoonMassGramsByCohort: readonly number[];
  readonly cocoonPricePerKg: number;
}>;
export type Output = Readonly<{
  readonly pooledObservedParasitismPercent: number;
  readonly expectedLostCocoonCounts: readonly number[];
  readonly expectedLostCocoonKg: number;
  readonly expectedRevenueLoss: number;
}>;
const inputFields = [
  {
    id: "inspectedLarvaeByCohort",
    label: "Inspected larvae by cohort",
    kind: "numberList",
  },
  {
    id: "parasitizedLarvaeByCohort",
    label: "Parasitized larvae by cohort",
    kind: "numberList",
  },
  {
    id: "lostCocoonFractionsAmongParasitized",
    label: "Lost cocoon fractions among parasitized",
    kind: "numberList",
  },
  {
    id: "expectedCocoonMassGramsByCohort",
    label: "Expected cocoon mass grams by cohort",
    kind: "numberList",
  },
  { id: "cocoonPricePerKg", label: "Cocoon price per kg", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.inspectedLarvaeByCohort.forEach((v) =>
    positive(v, "inspectedLarvaeByCohort"),
  );
  input.expectedCocoonMassGramsByCohort.forEach((v) =>
    nonnegative(v, "expectedCocoonMassGramsByCohort"),
  );
  nonnegative(input.cocoonPricePerKg, "cocoonPricePerKg");
  input.lostCocoonFractionsAmongParasitized.forEach((v) =>
    fraction(v, "lostCocoonFractionsAmongParasitized"),
  );
  input.inspectedLarvaeByCohort.forEach((v) =>
    count(v, "inspectedLarvaeByCohort"),
  );
  input.parasitizedLarvaeByCohort.forEach((v) =>
    count(v, "parasitizedLarvaeByCohort"),
  );
  aligned(
    input.inspectedLarvaeByCohort,
    input.parasitizedLarvaeByCohort,
    "inspectedLarvaeByCohort",
  );
  aligned(
    input.inspectedLarvaeByCohort,
    input.lostCocoonFractionsAmongParasitized,
    "inspectedLarvaeByCohort",
  );
  aligned(
    input.inspectedLarvaeByCohort,
    input.expectedCocoonMassGramsByCohort,
    "inspectedLarvaeByCohort",
  );
  if (
    input.parasitizedLarvaeByCohort.some(
      (v, i) => v > input.inspectedLarvaeByCohort[i],
    )
  )
    simpleError(
      "parasitizedLarvaeByCohort",
      "Observed parasitized count cannot exceed inspected count.",
    );
  const expectedLostCocoonCounts = input.parasitizedLarvaeByCohort.map(
      (v, i) => v * input.lostCocoonFractionsAmongParasitized[i],
    ),
    expectedLostCocoonKg = expectedLostCocoonCounts.reduce(
      (s, v, i) => s + (v * input.expectedCocoonMassGramsByCohort[i]) / 1000,
      0,
    );
  return {
    pooledObservedParasitismPercent:
      (100 * input.parasitizedLarvaeByCohort.reduce((a, b) => a + b, 0)) /
      input.inspectedLarvaeByCohort.reduce((a, b) => a + b, 0),
    expectedLostCocoonCounts,
    expectedLostCocoonKg,
    expectedRevenueLoss: expectedLostCocoonKg * input.cocoonPricePerKg,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  inspectedLarvaeByCohort: [100, 200],
  parasitizedLarvaeByCohort: [10, 20],
  lostCocoonFractionsAmongParasitized: [0.5, 1],
  expectedCocoonMassGramsByCohort: [2, 3],
  cocoonPricePerKg: 5,
} satisfies Input;
export const exampleOutput = {
  pooledObservedParasitismPercent: 10,
  expectedLostCocoonCounts: [5, 20],
  expectedLostCocoonKg: 0.07,
  expectedRevenueLoss: 0.35,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sericulture/uzi-fly-parasitism-percent-loss",
  title: "Uzi Fly Parasitism Percent Loss",
  description:
    "Estimate cohort-specific cocoon/revenue losses from observed uzi parasitism and supplied conditional harvest-loss assumptions; prevalence does not itself imply universal mortality.",
  inputs: inputFields,
  outputs: [
    {
      id: "pooledObservedParasitismPercent",
      label: "Pooled observed parasitism percent",
      kind: "number",
    },
    {
      id: "expectedLostCocoonCounts",
      label: "Expected lost cocoon counts",
      kind: "numberList",
    },
    {
      id: "expectedLostCocoonKg",
      label: "Expected lost cocoon kg",
      kind: "number",
    },
    {
      id: "expectedRevenueLoss",
      label: "Expected revenue loss",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      inspectedLarvaeByCohort:
        value.inspectedLarvaeByCohort as readonly number[],
      parasitizedLarvaeByCohort:
        value.parasitizedLarvaeByCohort as readonly number[],
      lostCocoonFractionsAmongParasitized:
        value.lostCocoonFractionsAmongParasitized as readonly number[],
      expectedCocoonMassGramsByCohort:
        value.expectedCocoonMassGramsByCohort as readonly number[],
      cocoonPricePerKg: value.cocoonPricePerKg as number,
    }),
});
export const run = tool.execute;
export default tool;
