import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  aligned,
  catalogIndex,
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly callerInternationalQuarterRuleIds: readonly string[];
  readonly callerInternationalQuarterRuleValues: readonly number[];
  readonly queryInternationalQuarterRuleId: string;
  readonly observedInternationalQuarterRuleValue: number;
}>;
export type Output = Readonly<{
  readonly callerMatchedInternationalQuarterRuleValue: number;
  readonly signedObservedMinusInternationalQuarterRuleReference: number;
}>;
const inputFields = [
  {
    id: "callerInternationalQuarterRuleIds",
    label: "Caller international quarter rule ids",
    kind: "stringList",
  },
  {
    id: "callerInternationalQuarterRuleValues",
    label: "Caller international quarter rule values",
    kind: "numberList",
  },
  {
    id: "queryInternationalQuarterRuleId",
    label: "Query international quarter rule id",
    kind: "string",
  },
  {
    id: "observedInternationalQuarterRuleValue",
    label: "Observed international quarter rule value",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.callerInternationalQuarterRuleIds,
    input.callerInternationalQuarterRuleValues,
    "callerInternationalQuarterRuleIds",
  );
  input.callerInternationalQuarterRuleValues.forEach((v) =>
    nonnegative(v, "reference"),
  );
  nonnegative(input.observedInternationalQuarterRuleValue, "observation");
  const i = catalogIndex(
    input.callerInternationalQuarterRuleIds,
    input.queryInternationalQuarterRuleId,
  );
  return {
    callerMatchedInternationalQuarterRuleValue:
      input.callerInternationalQuarterRuleValues[i],
    signedObservedMinusInternationalQuarterRuleReference:
      input.observedInternationalQuarterRuleValue -
      input.callerInternationalQuarterRuleValues[i],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerInternationalQuarterRuleIds: ["a", "b"],
  callerInternationalQuarterRuleValues: [2, 4],
  queryInternationalQuarterRuleId: "b",
  observedInternationalQuarterRuleValue: 5,
} satisfies Input;
export const exampleOutput = {
  callerMatchedInternationalQuarterRuleValue: 4,
  signedObservedMinusInternationalQuarterRuleReference: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "forestry/international-quarter-inch-rule-yield-lookup",
  title: "International 1/4-Inch Rule Yield Lookup",
  description:
    "Audit verified International quarter-inch board-foot scaling reference. Audit caller independently verified matched reference against actual observation, not a fabricated specification. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerMatchedInternationalQuarterRuleValue",
      label: "Caller matched international quarter rule value",
      kind: "number",
    },
    {
      id: "signedObservedMinusInternationalQuarterRuleReference",
      label: "Signed observed minus international quarter rule reference",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerInternationalQuarterRuleIds:
        value.callerInternationalQuarterRuleIds as readonly string[],
      callerInternationalQuarterRuleValues:
        value.callerInternationalQuarterRuleValues as readonly number[],
      queryInternationalQuarterRuleId:
        value.queryInternationalQuarterRuleId as string,
      observedInternationalQuarterRuleValue:
        value.observedInternationalQuarterRuleValue as number,
    }),
});
export const run = tool.execute;
export default tool;
