import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  fraction,
  count,
  aligned,
  safeCeil,
} from "../shared.js";
export type Input = Readonly<{
  readonly confirmedDeadVinesByBlock: readonly number[];
  readonly unlocatedVinesByBlock: readonly number[];
  readonly callerUnlocatedReplacementFractions: readonly number[];
  readonly callerReplantEstablishmentFractions: readonly number[];
}>;
export type Output = Readonly<{
  readonly minimumConfirmedReplacementPositions: readonly number[];
  readonly modeledGrossReplacementVineOrders: readonly number[];
  readonly totalModeledGrossReplacementVines: number;
}>;
const inputFields = [
  {
    id: "confirmedDeadVinesByBlock",
    label: "Confirmed dead vines by block",
    kind: "numberList",
  },
  {
    id: "unlocatedVinesByBlock",
    label: "Unlocated vines by block",
    kind: "numberList",
  },
  {
    id: "callerUnlocatedReplacementFractions",
    label: "Caller unlocated replacement fractions",
    kind: "numberList",
  },
  {
    id: "callerReplantEstablishmentFractions",
    label: "Caller replant establishment fractions",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerReplantEstablishmentFractions.forEach((v) =>
    positive(v, "callerReplantEstablishmentFractions"),
  );
  input.callerUnlocatedReplacementFractions.forEach((v) =>
    fraction(v, "callerUnlocatedReplacementFractions"),
  );
  input.callerReplantEstablishmentFractions.forEach((v) =>
    fraction(v, "callerReplantEstablishmentFractions"),
  );
  input.confirmedDeadVinesByBlock.forEach((v) =>
    count(v, "confirmedDeadVinesByBlock"),
  );
  input.unlocatedVinesByBlock.forEach((v) => count(v, "unlocatedVinesByBlock"));
  aligned(
    input.confirmedDeadVinesByBlock,
    input.unlocatedVinesByBlock,
    "confirmedDeadVinesByBlock",
  );
  aligned(
    input.confirmedDeadVinesByBlock,
    input.callerUnlocatedReplacementFractions,
    "confirmedDeadVinesByBlock",
  );
  aligned(
    input.confirmedDeadVinesByBlock,
    input.callerReplantEstablishmentFractions,
    "confirmedDeadVinesByBlock",
  );
  const modeledGrossReplacementVineOrders = input.confirmedDeadVinesByBlock.map(
      (n, i) =>
        safeCeil(
          (n +
            input.unlocatedVinesByBlock[i] *
              input.callerUnlocatedReplacementFractions[i]) /
            input.callerReplantEstablishmentFractions[i],
          "replacementOrders",
        ),
    ),
    totalModeledGrossReplacementVines =
      modeledGrossReplacementVineOrders.reduce((a, b) => a + b, 0);
  count(totalModeledGrossReplacementVines, "totalOrders");
  return {
    minimumConfirmedReplacementPositions: [...input.confirmedDeadVinesByBlock],
    modeledGrossReplacementVineOrders,
    totalModeledGrossReplacementVines,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  confirmedDeadVinesByBlock: [10, 20],
  unlocatedVinesByBlock: [5, 0],
  callerUnlocatedReplacementFractions: [0.5, 0],
  callerReplantEstablishmentFractions: [0.5, 1],
} satisfies Input;
export const exampleOutput = {
  minimumConfirmedReplacementPositions: [10, 20],
  modeledGrossReplacementVineOrders: [25, 20],
  totalModeledGrossReplacementVines: 45,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "viticulture/replant-mortality-replacement-count",
  title: "Replant Mortality Replacement Count",
  description:
    "Budget block replant orders from confirmed dead positions plus explicit unlocated assumption and caller replant establishment, rounding each order separately; no missing-as-dead default or establishment guarantee.",
  inputs: inputFields,
  outputs: [
    {
      id: "minimumConfirmedReplacementPositions",
      label: "Minimum confirmed replacement positions",
      kind: "numberList",
    },
    {
      id: "modeledGrossReplacementVineOrders",
      label: "Modeled gross replacement vine orders",
      kind: "numberList",
    },
    {
      id: "totalModeledGrossReplacementVines",
      label: "Total modeled gross replacement vines",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      confirmedDeadVinesByBlock:
        value.confirmedDeadVinesByBlock as readonly number[],
      unlocatedVinesByBlock: value.unlocatedVinesByBlock as readonly number[],
      callerUnlocatedReplacementFractions:
        value.callerUnlocatedReplacementFractions as readonly number[],
      callerReplantEstablishmentFractions:
        value.callerReplantEstablishmentFractions as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
