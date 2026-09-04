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
  readonly callerSiteIndexIds: readonly string[];
  readonly callerSiteIndexValues: readonly number[];
  readonly querySiteIndexId: string;
  readonly observedSiteIndexValue: number;
}>;
export type Output = Readonly<{
  readonly callerMatchedSiteIndexValue: number;
  readonly signedObservedMinusSiteIndexReference: number;
}>;
const inputFields = [
  {
    id: "callerSiteIndexIds",
    label: "Caller site index ids",
    kind: "stringList",
  },
  {
    id: "callerSiteIndexValues",
    label: "Caller site index values",
    kind: "numberList",
  },
  { id: "querySiteIndexId", label: "Query site index id", kind: "string" },
  {
    id: "observedSiteIndexValue",
    label: "Observed site index value",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.callerSiteIndexIds,
    input.callerSiteIndexValues,
    "callerSiteIndexIds",
  );
  input.callerSiteIndexValues.forEach((v) => nonnegative(v, "reference"));
  nonnegative(input.observedSiteIndexValue, "observation");
  const i = catalogIndex(input.callerSiteIndexIds, input.querySiteIndexId);
  return {
    callerMatchedSiteIndexValue: input.callerSiteIndexValues[i],
    signedObservedMinusSiteIndexReference:
      input.observedSiteIndexValue - input.callerSiteIndexValues[i],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerSiteIndexIds: ["a", "b"],
  callerSiteIndexValues: [2, 4],
  querySiteIndexId: "b",
  observedSiteIndexValue: 5,
} satisfies Input;
export const exampleOutput = {
  callerMatchedSiteIndexValue: 4,
  signedObservedMinusSiteIndexReference: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "forestry/site-index",
  title: "Site Index Calculator",
  description:
    "Audit independently classified local site index reference. Audit caller independently verified matched reference against actual observation, not a fabricated specification. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerMatchedSiteIndexValue",
      label: "Caller matched site index value",
      kind: "number",
    },
    {
      id: "signedObservedMinusSiteIndexReference",
      label: "Signed observed minus site index reference",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerSiteIndexIds: value.callerSiteIndexIds as readonly string[],
      callerSiteIndexValues: value.callerSiteIndexValues as readonly number[],
      querySiteIndexId: value.querySiteIndexId as string,
      observedSiteIndexValue: value.observedSiteIndexValue as number,
    }),
});
export const run = tool.execute;
export default tool;
