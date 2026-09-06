import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedCumulativeProducedStockGasM3: number;
  readonly callerIndependentlyEstablishedOriginalStockGasM3: number;
  readonly observedIndependentRemainingStockGasM3: number;
}>;
export type Output = Readonly<{
  readonly observedGasProductionRecoveryFraction: number;
  readonly signedRemainingGasBalanceDiscrepancyM3: number;
}>;
const inputFields = [
  {
    id: "observedCumulativeProducedStockGasM3",
    label: "Observed cumulative produced stock gas m3",
    kind: "number",
  },
  {
    id: "callerIndependentlyEstablishedOriginalStockGasM3",
    label: "Caller independently established original stock gas m3",
    kind: "number",
  },
  {
    id: "observedIndependentRemainingStockGasM3",
    label: "Observed independent remaining stock gas m3",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.callerIndependentlyEstablishedOriginalStockGasM3,
    "callerIndependentlyEstablishedOriginalStockGasM3",
  );
  nonnegative(
    input.observedCumulativeProducedStockGasM3,
    "observedCumulativeProducedStockGasM3",
  );
  nonnegative(
    input.observedIndependentRemainingStockGasM3,
    "observedIndependentRemainingStockGasM3",
  );
  return {
    observedGasProductionRecoveryFraction:
      input.observedCumulativeProducedStockGasM3 /
      input.callerIndependentlyEstablishedOriginalStockGasM3,
    signedRemainingGasBalanceDiscrepancyM3:
      input.observedIndependentRemainingStockGasM3 -
      (input.callerIndependentlyEstablishedOriginalStockGasM3 -
        input.observedCumulativeProducedStockGasM3),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedCumulativeProducedStockGasM3: 20,
  callerIndependentlyEstablishedOriginalStockGasM3: 100,
  observedIndependentRemainingStockGasM3: 75,
} satisfies Input;
export const exampleOutput = {
  observedGasProductionRecoveryFraction: 0.2,
  signedRemainingGasBalanceDiscrepancyM3: -5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "petroleum/recovery-factor-gas",
  title: "Petroleum Recovery Factor Gas Calculator",
  description:
    "Audit actual produced gas against independently established original/remaining stock inventory, recovery>1 and signed mismatch retained; not reserve recovery-factor prediction. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedGasProductionRecoveryFraction",
      label: "Observed gas production recovery fraction",
      kind: "number",
    },
    {
      id: "signedRemainingGasBalanceDiscrepancyM3",
      label: "Signed remaining gas balance discrepancy m3",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedCumulativeProducedStockGasM3:
        value.observedCumulativeProducedStockGasM3 as number,
      callerIndependentlyEstablishedOriginalStockGasM3:
        value.callerIndependentlyEstablishedOriginalStockGasM3 as number,
      observedIndependentRemainingStockGasM3:
        value.observedIndependentRemainingStockGasM3 as number,
    }),
});
export const run = tool.execute;
export default tool;
