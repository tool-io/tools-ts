import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  catalogIndex,
} from "../batch40-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedAcquihireTalentPriceKeys: readonly string[];
  readonly callerVerifiedAcquihireTalentPriceValues: readonly number[];
  readonly queryAcquihireTalentPriceKey: string;
  readonly observedAcquihireTalentPriceValue: number;
}>;
export type Output = Readonly<{
  readonly callerReferenceValue: number;
  readonly signedObservedMinusReference: number;
}>;
const inputFields = [
  {
    id: "callerVerifiedAcquihireTalentPriceKeys",
    label: "Caller verified acquihire talent price keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedAcquihireTalentPriceValues",
    label: "Caller verified acquihire talent price values",
    kind: "numberList",
  },
  {
    id: "queryAcquihireTalentPriceKey",
    label: "Query acquihire talent price key",
    kind: "string",
  },
  {
    id: "observedAcquihireTalentPriceValue",
    label: "Observed acquihire talent price value",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.callerVerifiedAcquihireTalentPriceKeys,
    input.callerVerifiedAcquihireTalentPriceValues,
    "callerVerifiedAcquihireTalentPriceKeys",
  );
  const i = catalogIndex(
    input.callerVerifiedAcquihireTalentPriceKeys,
    input.queryAcquihireTalentPriceKey,
  );
  return {
    callerReferenceValue: input.callerVerifiedAcquihireTalentPriceValues[i],
    signedObservedMinusReference:
      input.observedAcquihireTalentPriceValue -
      input.callerVerifiedAcquihireTalentPriceValues[i],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedAcquihireTalentPriceKeys: ["a", "b"],
  callerVerifiedAcquihireTalentPriceValues: [2, 4],
  queryAcquihireTalentPriceKey: "b",
  observedAcquihireTalentPriceValue: 5,
} satisfies Input;
export const exampleOutput = {
  callerReferenceValue: 4,
  signedObservedMinusReference: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "entrepreneurship/acqui-hire-talent-price-per-engineer-heuristic-lookup",
  title: "Acqui Hire Talent Price Per Engineer Heuristic Lookup",
  description:
    "Observed independently talent-attributed deal price/headcount vs caller matched benchmark, no company-value prediction. Exact independently matched reference; signed deviations retained. Caller independently verifies policy, evidence, dates and applicability; not legal/compliance advice or causal business-success prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerReferenceValue",
      label: "Caller reference value",
      kind: "number",
    },
    {
      id: "signedObservedMinusReference",
      label: "Signed observed minus reference",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerVerifiedAcquihireTalentPriceKeys:
        value.callerVerifiedAcquihireTalentPriceKeys as readonly string[],
      callerVerifiedAcquihireTalentPriceValues:
        value.callerVerifiedAcquihireTalentPriceValues as readonly number[],
      queryAcquihireTalentPriceKey:
        value.queryAcquihireTalentPriceKey as string,
      observedAcquihireTalentPriceValue:
        value.observedAcquihireTalentPriceValue as number,
    }),
});
export const run = tool.execute;
export default tool;
