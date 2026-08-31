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
  binary,
  shape,
  independentGroups,
} from "../batch-shared.js";
export type Input = Readonly<{
  readonly claimLabels: readonly string[];
  readonly sourceDependencyGroupIds: readonly string[];
  readonly claimSourceCorroborationFlags: readonly (readonly number[])[];
  readonly callerMinimumIndependentGroups: number;
}>;
export type Output = Readonly<{
  readonly distinctCorroboratingGroupCounts: readonly number[];
  readonly claimsBelowCallerCanvassPolicy: readonly string[];
}>;
const inputFields = [
  { id: "claimLabels", label: "Claim labels", kind: "stringList" },
  {
    id: "sourceDependencyGroupIds",
    label: "Source dependency group ids",
    kind: "stringList",
  },
  {
    id: "claimSourceCorroborationFlags",
    label: "Claim source corroboration flags",
    kind: "matrix",
  },
  {
    id: "callerMinimumIndependentGroups",
    label: "Caller minimum independent groups",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  unique(input.claimLabels, "claims");
  if (
    input.sourceDependencyGroupIds.some((s) => !s.trim()) ||
    shape(input.claimSourceCorroborationFlags, "claims") !==
      input.sourceDependencyGroupIds.length ||
    input.claimSourceCorroborationFlags.length !== input.claimLabels.length
  )
    simpleError(
      "evidence",
      "Aligned claim×source flags with explicit dependency-group labels required.",
    );
  bounded(input.callerMinimumIndependentGroups, "minimum", 1, 128);
  input.claimSourceCorroborationFlags.forEach((r) => binary(r, "flags"));
  const counts = input.claimSourceCorroborationFlags.map(
    (r) => independentGroups(input.sourceDependencyGroupIds, r).length,
  );
  return {
    distinctCorroboratingGroupCounts: counts,
    claimsBelowCallerCanvassPolicy: input.claimLabels.filter(
      (_, i) => counts[i] < input.callerMinimumIndependentGroups,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  claimLabels: ["A", "B"],
  sourceDependencyGroupIds: ["wire", "wire", "local"],
  claimSourceCorroborationFlags: [
    [1, 1, 0],
    [1, 0, 1],
  ],
  callerMinimumIndependentGroups: 2,
} satisfies Input;
export const exampleOutput = {
  distinctCorroboratingGroupCounts: [1, 2],
  claimsBelowCallerCanvassPolicy: ["A"],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "journalism/rule-of-three-sources-stat-canvass-lookup",
  title: "Rule of Three Sources Stat Canvass Lookup",
  description:
    "Canvass claim-by-source support using explicit caller source-dependency groups and minimum independent count; copied wire sources count once and three is not a universal truth-verification rule.",
  inputs: inputFields,
  outputs: [
    {
      id: "distinctCorroboratingGroupCounts",
      label: "Distinct corroborating group counts",
      kind: "numberList",
    },
    {
      id: "claimsBelowCallerCanvassPolicy",
      label: "Claims below caller canvass policy",
      kind: "stringList",
    },
  ],
  calculate: (value) =>
    calculate({
      claimLabels: value.claimLabels as readonly string[],
      sourceDependencyGroupIds:
        value.sourceDependencyGroupIds as readonly string[],
      claimSourceCorroborationFlags:
        value.claimSourceCorroborationFlags as readonly (readonly number[])[],
      callerMinimumIndependentGroups:
        value.callerMinimumIndependentGroups as number,
    }),
});
export const run = tool.execute;
export default tool;
