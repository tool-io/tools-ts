import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  sum,
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedOreWeighedTonnes: readonly number[];
  readonly observedWasteWeighedTonnes: readonly number[];
  readonly observedIndependentLedgerOreWasteRatio: number;
}>;
export type Output = Readonly<{
  readonly observedWeighedOreWasteRatio: number;
  readonly signedLedgerRatioDiscrepancy: number;
}>;
const inputFields = [
  {
    id: "observedOreWeighedTonnes",
    label: "Observed ore weighed tonnes",
    kind: "numberList",
  },
  {
    id: "observedWasteWeighedTonnes",
    label: "Observed waste weighed tonnes",
    kind: "numberList",
  },
  {
    id: "observedIndependentLedgerOreWasteRatio",
    label: "Observed independent ledger ore waste ratio",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedOreWeighedTonnes.forEach((v) =>
    nonnegative(v, "observedOreWeighedTonnes"),
  );
  input.observedWasteWeighedTonnes.forEach((v) =>
    nonnegative(v, "observedWasteWeighedTonnes"),
  );
  nonnegative(
    input.observedIndependentLedgerOreWasteRatio,
    "observedIndependentLedgerOreWasteRatio",
  );
  const waste = sum(input.observedWasteWeighedTonnes);
  positive(waste, "weighed waste");
  const ratio = sum(input.observedOreWeighedTonnes) / waste;
  return {
    observedWeighedOreWasteRatio: ratio,
    signedLedgerRatioDiscrepancy:
      input.observedIndependentLedgerOreWasteRatio - ratio,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedOreWeighedTonnes: [10, 20],
  observedWasteWeighedTonnes: [5, 15],
  observedIndependentLedgerOreWasteRatio: 2,
} satisfies Input;
export const exampleOutput = {
  observedWeighedOreWasteRatio: 1.5,
  signedLedgerRatioDiscrepancy: 0.5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/ore-waste-ratio",
  title: "Ore Waste Ratio Calculator",
  description:
    "Audit actual separate ore/waste weighing ledger against independent reported inverse stripping ratio, not bank-volume density forward stripping model. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedWeighedOreWasteRatio",
      label: "Observed weighed ore waste ratio",
      kind: "number",
    },
    {
      id: "signedLedgerRatioDiscrepancy",
      label: "Signed ledger ratio discrepancy",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedOreWeighedTonnes:
        value.observedOreWeighedTonnes as readonly number[],
      observedWasteWeighedTonnes:
        value.observedWasteWeighedTonnes as readonly number[],
      observedIndependentLedgerOreWasteRatio:
        value.observedIndependentLedgerOreWasteRatio as number,
    }),
});
export const run = tool.execute;
export default tool;
