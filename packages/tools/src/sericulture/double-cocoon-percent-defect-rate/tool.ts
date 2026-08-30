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
  readonly inspectedCocoonsByLot: readonly number[];
  readonly doubleCocoonsByLot: readonly number[];
  readonly singlePricePerKg: number;
  readonly doublePricePerKg: number;
  readonly lotNetMassKg: number;
  readonly callerDoubleCountLimitFraction: number;
}>;
export type Output = Readonly<{
  readonly doubleCountPercentByLot: readonly number[];
  readonly pooledDoubleCountPercent: number;
  readonly aboveCallerCountLimit: boolean;
  readonly equalMassMixValue: number;
}>;
const inputFields = [
  {
    id: "inspectedCocoonsByLot",
    label: "Inspected cocoons by lot",
    kind: "numberList",
  },
  {
    id: "doubleCocoonsByLot",
    label: "Double cocoons by lot",
    kind: "numberList",
  },
  { id: "singlePricePerKg", label: "Single price per kg", kind: "number" },
  { id: "doublePricePerKg", label: "Double price per kg", kind: "number" },
  { id: "lotNetMassKg", label: "Lot net mass kg", kind: "number" },
  {
    id: "callerDoubleCountLimitFraction",
    label: "Caller double count limit fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.inspectedCocoonsByLot.forEach((v) =>
    positive(v, "inspectedCocoonsByLot"),
  );
  nonnegative(input.singlePricePerKg, "singlePricePerKg");
  nonnegative(input.doublePricePerKg, "doublePricePerKg");
  nonnegative(input.lotNetMassKg, "lotNetMassKg");
  fraction(
    input.callerDoubleCountLimitFraction,
    "callerDoubleCountLimitFraction",
  );
  input.inspectedCocoonsByLot.forEach((v) => count(v, "inspectedCocoonsByLot"));
  input.doubleCocoonsByLot.forEach((v) => count(v, "doubleCocoonsByLot"));
  aligned(
    input.inspectedCocoonsByLot,
    input.doubleCocoonsByLot,
    "inspectedCocoonsByLot",
  );
  if (
    input.doubleCocoonsByLot.some((v, i) => v > input.inspectedCocoonsByLot[i])
  )
    simpleError(
      "doubleCocoonsByLot",
      "Double count cannot exceed inspected count.",
    );
  const share =
    input.doubleCocoonsByLot.reduce((a, b) => a + b, 0) /
    input.inspectedCocoonsByLot.reduce((a, b) => a + b, 0);
  return {
    doubleCountPercentByLot: input.doubleCocoonsByLot.map(
      (v, i) => (100 * v) / input.inspectedCocoonsByLot[i],
    ),
    pooledDoubleCountPercent: 100 * share,
    aboveCallerCountLimit: share > input.callerDoubleCountLimitFraction,
    equalMassMixValue:
      input.lotNetMassKg *
      ((1 - share) * input.singlePricePerKg + share * input.doublePricePerKg),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  inspectedCocoonsByLot: [100, 200],
  doubleCocoonsByLot: [10, 40],
  singlePricePerKg: 5,
  doublePricePerKg: 2,
  lotNetMassKg: 30,
  callerDoubleCountLimitFraction: 0.15,
} satisfies Input;
export const exampleOutput = {
  doubleCountPercentByLot: [10, 20],
  pooledDoubleCountPercent: 16.666666666666668,
  aboveCallerCountLimit: true,
  equalMassMixValue: 135,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sericulture/double-cocoon-percent-defect-rate",
  title: "Double Cocoon Percent Defect Rate",
  description:
    "Audit double-cocoon count share and a caller equal-mass price-discount scenario; count share is not claimed to be measured double-cocoon mass share.",
  inputs: inputFields,
  outputs: [
    {
      id: "doubleCountPercentByLot",
      label: "Double count percent by lot",
      kind: "numberList",
    },
    {
      id: "pooledDoubleCountPercent",
      label: "Pooled double count percent",
      kind: "number",
    },
    {
      id: "aboveCallerCountLimit",
      label: "Above caller count limit",
      kind: "boolean",
    },
    { id: "equalMassMixValue", label: "Equal mass mix value", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      inspectedCocoonsByLot: value.inspectedCocoonsByLot as readonly number[],
      doubleCocoonsByLot: value.doubleCocoonsByLot as readonly number[],
      singlePricePerKg: value.singlePricePerKg as number,
      doublePricePerKg: value.doublePricePerKg as number,
      lotNetMassKg: value.lotNetMassKg as number,
      callerDoubleCountLimitFraction:
        value.callerDoubleCountLimitFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
