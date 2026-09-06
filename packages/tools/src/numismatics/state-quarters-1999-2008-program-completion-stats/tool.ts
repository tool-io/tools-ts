import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  aligned,
  unique,
} from "../batch45-shared.js";
export type Input = Readonly<{
  readonly callerDistinctJurisdictionIds: readonly string[];
  readonly callerObservedIssueYears: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerDistinctJurisdictionIds",
    label: "Caller distinct jurisdiction ids",
    kind: "stringList",
  },
  {
    id: "callerObservedIssueYears",
    label: "Caller observed issue years",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  unique(input.callerDistinctJurisdictionIds, "jurisdictions");
  aligned(
    input.callerDistinctJurisdictionIds,
    input.callerObservedIssueYears,
    "years",
  );
  input.callerObservedIssueYears.forEach((v) => bounded(v, "year", 1, 9999));
  const inRange = (v: number) => v >= 1999 && v <= 2008;
  return {
    in1999To2008ProgramJurisdictionIds:
      input.callerDistinctJurisdictionIds.filter((_, i) =>
        inRange(input.callerObservedIssueYears[i]),
      ),
    outsideProgramJurisdictionIds: input.callerDistinctJurisdictionIds.filter(
      (_, i) => !inRange(input.callerObservedIssueYears[i]),
    ),
    distinctObservedProgramJurisdictionCount:
      input.callerObservedIssueYears.filter(inRange).length,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerDistinctJurisdictionIds: ["a", "b", "c"],
    callerObservedIssueYears: [1999, 2008, 2009],
  },
  output: {
    result: {
      in1999To2008ProgramJurisdictionIds: ["a", "b"],
      outsideProgramJurisdictionIds: ["c"],
      distinctObservedProgramJurisdictionCount: 2,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "numismatics/state-quarters-1999-2008-program-completion-stats",
  title: "State Quarters 1999\u20132008 Program Completion Stats",
  description:
    "Inventory independently identified distinct State Quarters jurisdiction records in 1999\u20132008 issue window, retaining outside-year records separately. Caller verifies genuine program/type identity; year alone does not establish state membership,50-target completeness or authenticity.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
