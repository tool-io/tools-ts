import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  fraction,
  aligned,
} from "../shared.js";
export type Input = Readonly<{
  readonly grossLotMassesKg: readonly number[];
  readonly containerTaresKg: readonly number[];
  readonly deductibleMoistureFractions: readonly number[];
  readonly scaleCorrectionsKg: readonly number[];
}>;
export type Output = Readonly<{
  readonly tareCorrectedLotMassesKg: readonly number[];
  readonly payableLotMassesKg: readonly number[];
  readonly totalPayableMassKg: number;
}>;
const inputFields = [
  { id: "grossLotMassesKg", label: "Gross lot masses kg", kind: "numberList" },
  { id: "containerTaresKg", label: "Container tares kg", kind: "numberList" },
  {
    id: "deductibleMoistureFractions",
    label: "Deductible moisture fractions",
    kind: "numberList",
  },
  {
    id: "scaleCorrectionsKg",
    label: "Scale corrections kg",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.grossLotMassesKg.forEach((v) => nonnegative(v, "grossLotMassesKg"));
  input.containerTaresKg.forEach((v) => nonnegative(v, "containerTaresKg"));
  input.deductibleMoistureFractions.forEach((v) =>
    fraction(v, "deductibleMoistureFractions"),
  );
  aligned(input.grossLotMassesKg, input.containerTaresKg, "grossLotMassesKg");
  aligned(
    input.grossLotMassesKg,
    input.deductibleMoistureFractions,
    "grossLotMassesKg",
  );
  aligned(input.grossLotMassesKg, input.scaleCorrectionsKg, "grossLotMassesKg");
  const tareCorrectedLotMassesKg = input.grossLotMassesKg.map((v, i) =>
      nonnegative(
        v + input.scaleCorrectionsKg[i] - input.containerTaresKg[i],
        "containerTaresKg",
      ),
    ),
    payableLotMassesKg = tareCorrectedLotMassesKg.map(
      (v, i) => v * (1 - input.deductibleMoistureFractions[i]),
    );
  return {
    tareCorrectedLotMassesKg,
    payableLotMassesKg,
    totalPayableMassKg: payableLotMassesKg.reduce((a, b) => a + b, 0),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  grossLotMassesKg: [100, 200],
  containerTaresKg: [10, 20],
  deductibleMoistureFractions: [0.1, 0.2],
  scaleCorrectionsKg: [1, -1],
} satisfies Input;
export const exampleOutput = {
  tareCorrectedLotMassesKg: [91, 179],
  payableLotMassesKg: [81.9, 143.2],
  totalPayableMassKg: 225.1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sericulture/auction-lot-net-weight-tare-adjustment",
  title: "Auction Lot Net Weight Tare Adjustment",
  description:
    "Audit auction-lot tare/scale corrections and caller moisture deductions separately by lot; deductions are contract inputs, not a mandatory auction rule or an agreed-regain conditioning formula.",
  inputs: inputFields,
  outputs: [
    {
      id: "tareCorrectedLotMassesKg",
      label: "Tare corrected lot masses kg",
      kind: "numberList",
    },
    {
      id: "payableLotMassesKg",
      label: "Payable lot masses kg",
      kind: "numberList",
    },
    {
      id: "totalPayableMassKg",
      label: "Total payable mass kg",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      grossLotMassesKg: value.grossLotMassesKg as readonly number[],
      containerTaresKg: value.containerTaresKg as readonly number[],
      deductibleMoistureFractions:
        value.deductibleMoistureFractions as readonly number[],
      scaleCorrectionsKg: value.scaleCorrectionsKg as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
