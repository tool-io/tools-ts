import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  unique,
  bounded,
  aligned,
  binary,
  independentGroups,
} from "../batch-shared.js";
export type Input = Readonly<{
  readonly sourceIds: readonly string[];
  readonly callerDependencyGroupIds: readonly string[];
  readonly observedCorroborationFlags: readonly number[];
  readonly callerRequiredIndependentCount: number;
}>;
export type Output = Readonly<{
  readonly distinctSupportingDependencyGroupIds: readonly string[];
  readonly observedSupportingSourceCount: number;
  readonly independentGroupCount: number;
  readonly meetsCallerIndependencePolicy: boolean;
}>;
const inputFields = [
  { id: "sourceIds", label: "Source ids", kind: "stringList" },
  {
    id: "callerDependencyGroupIds",
    label: "Caller dependency group ids",
    kind: "stringList",
  },
  {
    id: "observedCorroborationFlags",
    label: "Observed corroboration flags",
    kind: "numberList",
  },
  {
    id: "callerRequiredIndependentCount",
    label: "Caller required independent count",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  binary(input.observedCorroborationFlags, "observedCorroborationFlags");
  aligned(input.sourceIds, input.callerDependencyGroupIds, "sourceIds");
  aligned(input.sourceIds, input.observedCorroborationFlags, "sourceIds");
  unique(input.sourceIds, "sources");
  if (input.callerDependencyGroupIds.some((v) => !v.trim()))
    simpleError(
      "groups",
      "Explicit source dependency-group identities required.",
    );
  bounded(input.callerRequiredIndependentCount, "minimum", 1, 128);
  const groups = independentGroups(
    input.callerDependencyGroupIds,
    input.observedCorroborationFlags,
  );
  return {
    distinctSupportingDependencyGroupIds: groups,
    observedSupportingSourceCount: input.observedCorroborationFlags.filter(
      (v) => v === 1,
    ).length,
    independentGroupCount: groups.length,
    meetsCallerIndependencePolicy:
      groups.length >= input.callerRequiredIndependentCount,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  sourceIds: ["a", "b", "c"],
  callerDependencyGroupIds: ["wire", "wire", "own"],
  observedCorroborationFlags: [1, 1, 0],
  callerRequiredIndependentCount: 2,
} satisfies Input;
export const exampleOutput = {
  distinctSupportingDependencyGroupIds: ["wire"],
  observedSupportingSourceCount: 2,
  independentGroupCount: 1,
  meetsCallerIndependencePolicy: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "journalism/two-independent-sources-verification-rule-checker",
  title: "Two Independent Sources Verification Rule Checker",
  description:
    "Audit source-level corroboration with actual distinct records and caller dependency provenance, so copies of one origin count once; differs from scalar corroboration counts and multi-claim canvass, no automated claim truth or guarantee of independence.",
  inputs: inputFields,
  outputs: [
    {
      id: "distinctSupportingDependencyGroupIds",
      label: "Distinct supporting dependency group ids",
      kind: "stringList",
    },
    {
      id: "observedSupportingSourceCount",
      label: "Observed supporting source count",
      kind: "number",
    },
    {
      id: "independentGroupCount",
      label: "Independent group count",
      kind: "number",
    },
    {
      id: "meetsCallerIndependencePolicy",
      label: "Meets caller independence policy",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      sourceIds: value.sourceIds as readonly string[],
      callerDependencyGroupIds:
        value.callerDependencyGroupIds as readonly string[],
      observedCorroborationFlags:
        value.observedCorroborationFlags as readonly number[],
      callerRequiredIndependentCount:
        value.callerRequiredIndependentCount as number,
    }),
});
export const run = tool.execute;
export default tool;
