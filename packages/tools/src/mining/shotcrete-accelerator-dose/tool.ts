import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
  aligned,
  sum,
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedAlreadyAddedAcceleratorKg: readonly number[];
  readonly observedMatchedCementBinderKg: readonly number[];
  readonly callerVerifiedAcceleratorActiveFractions: readonly number[];
}>;
export type Output = Readonly<{
  readonly observedProductAcceleratorBinderFraction: number;
  readonly observedActiveAcceleratorBinderFraction: number;
}>;
const inputFields = [
  {
    id: "observedAlreadyAddedAcceleratorKg",
    label: "Observed already added accelerator kg",
    kind: "numberList",
  },
  {
    id: "observedMatchedCementBinderKg",
    label: "Observed matched cement binder kg",
    kind: "numberList",
  },
  {
    id: "callerVerifiedAcceleratorActiveFractions",
    label: "Caller verified accelerator active fractions",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedMatchedCementBinderKg.forEach((v) =>
    positive(v, "observedMatchedCementBinderKg"),
  );
  input.observedAlreadyAddedAcceleratorKg.forEach((v) =>
    nonnegative(v, "observedAlreadyAddedAcceleratorKg"),
  );
  input.callerVerifiedAcceleratorActiveFractions.forEach((v) =>
    fraction(v, "callerVerifiedAcceleratorActiveFractions"),
  );
  aligned(
    input.observedAlreadyAddedAcceleratorKg,
    input.observedMatchedCementBinderKg,
    "observedAlreadyAddedAcceleratorKg",
  );
  aligned(
    input.observedAlreadyAddedAcceleratorKg,
    input.callerVerifiedAcceleratorActiveFractions,
    "observedAlreadyAddedAcceleratorKg",
  );
  const binder = sum(input.observedMatchedCementBinderKg);
  return {
    observedProductAcceleratorBinderFraction:
      sum(input.observedAlreadyAddedAcceleratorKg) / binder,
    observedActiveAcceleratorBinderFraction:
      sum(
        input.observedAlreadyAddedAcceleratorKg.map(
          (v, i) => v * input.callerVerifiedAcceleratorActiveFractions[i],
        ),
      ) / binder,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedAlreadyAddedAcceleratorKg: [2, 3],
  observedMatchedCementBinderKg: [100, 200],
  callerVerifiedAcceleratorActiveFractions: [0.5, 0.2],
} satisfies Input;
export const exampleOutput = {
  observedProductAcceleratorBinderFraction: 0.016666666666666666,
  observedActiveAcceleratorBinderFraction: 0.005333333333333334,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/shotcrete-accelerator-dose",
  title: "Shotcrete Accelerator Dose Calculator",
  description:
    "Audit already added shotcrete accelerator/cement binder mass ledger with verified active content, not chemical dose prescription, strength efficacy or material safety. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedProductAcceleratorBinderFraction",
      label: "Observed product accelerator binder fraction",
      kind: "number",
    },
    {
      id: "observedActiveAcceleratorBinderFraction",
      label: "Observed active accelerator binder fraction",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedAlreadyAddedAcceleratorKg:
        value.observedAlreadyAddedAcceleratorKg as readonly number[],
      observedMatchedCementBinderKg:
        value.observedMatchedCementBinderKg as readonly number[],
      callerVerifiedAcceleratorActiveFractions:
        value.callerVerifiedAcceleratorActiveFractions as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
