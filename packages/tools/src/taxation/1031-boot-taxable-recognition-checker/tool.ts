import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, money, sumMoney } from "../batch39-shared.js";
export type Input = Readonly<{
  readonly realizedGainMinor: number;
  readonly receivedCashBootMinor: number;
  readonly independentlyNetDebtReliefBootMinor: number;
}>;
export type Output = Readonly<{
  readonly conditionalRecognizedGainMinor: number;
  readonly conditionalDeferredGainMinor: number;
}>;
const inputFields = [
  { id: "realizedGainMinor", label: "Realized gain minor", kind: "number" },
  {
    id: "receivedCashBootMinor",
    label: "Received cash boot minor",
    kind: "number",
  },
  {
    id: "independentlyNetDebtReliefBootMinor",
    label: "Independently net debt relief boot minor",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  money(input.realizedGainMinor, "realizedGainMinor");
  money(input.receivedCashBootMinor, "receivedCashBootMinor");
  money(
    input.independentlyNetDebtReliefBootMinor,
    "independentlyNetDebtReliefBootMinor",
  );
  const b = sumMoney([
      input.receivedCashBootMinor,
      input.independentlyNetDebtReliefBootMinor,
    ]),
    r = Math.min(b, input.realizedGainMinor);
  return {
    conditionalRecognizedGainMinor: r,
    conditionalDeferredGainMinor: input.realizedGainMinor - r,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  realizedGainMinor: 100,
  receivedCashBootMinor: 40,
  independentlyNetDebtReliefBootMinor: 20,
} satisfies Input;
export const exampleOutput = {
  conditionalRecognizedGainMinor: 60,
  conditionalDeferredGainMinor: 40,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "taxation/1031-boot-taxable-recognition-checker",
  title: "1031 Boot Taxable Recognition Checker",
  description:
    "1031positive realized gain recognized up to independently eligible cash+net debt-relief boot; debt netting/non-like-kind valuation/eligibility caller established. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "conditionalRecognizedGainMinor",
      label: "Conditional recognized gain minor",
      kind: "number",
    },
    {
      id: "conditionalDeferredGainMinor",
      label: "Conditional deferred gain minor",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      realizedGainMinor: value.realizedGainMinor as number,
      receivedCashBootMinor: value.receivedCashBootMinor as number,
      independentlyNetDebtReliefBootMinor:
        value.independentlyNetDebtReliefBootMinor as number,
    }),
});
export const run = tool.execute;
export default tool;
