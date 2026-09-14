import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  aligned,
  unique,
} from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualFlagLabels: readonly string[];
  readonly callerIndependentApplicablePrecedenceRanks: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "actualFlagLabels", label: "Actual flag labels", kind: "stringList" },
  {
    id: "callerIndependentApplicablePrecedenceRanks",
    label: "Caller independent applicable precedence ranks",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  unique(input.actualFlagLabels, "flags");
  aligned(
    input.actualFlagLabels,
    input.callerIndependentApplicablePrecedenceRanks,
    "ranks",
  );
  input.callerIndependentApplicablePrecedenceRanks.forEach((v) =>
    bounded(v, "rank", 0, 10000),
  );
  const ranks = [
      ...new Set(input.callerIndependentApplicablePrecedenceRanks),
    ].sort((a, b) => a - b),
    groups = ranks.map((k) =>
      input.actualFlagLabels.filter(
        (_, i) => input.callerIndependentApplicablePrecedenceRanks[i] === k,
      ),
    );
  return {
    orderedFlagGroups: groups,
    hasUnresolvedEqualRank: groups.some((a) => a.length > 1),
  };
};
export const calculate = (
  input: Input,
  context?: ToolExecutionContext,
): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: {
    actualFlagLabels: ["a", "b", "c"],
    callerIndependentApplicablePrecedenceRanks: [2, 1, 1],
  },
  output: {
    result: {
      orderedFlagGroups: [["b", "c"], ["a"]],
      hasUnresolvedEqualRank: true,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "vexillology/multi-flag-row-planner",
  title: "Multiple Flag Row Ordering Planner",
  description:
    "Multipleflagrowprioritygroupsfromindependentqualifiedranks,tiesnot arbitrarilyresolved,geometry/audienceside protocol external. Actual independently applicable flag/cloth/manufacturer/jurisdiction/protocol/sourceedition,units/calibration and observations external;not legal/display precedence,authenticity,visibility or structural safety approval.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value, context) => calculate(value as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
