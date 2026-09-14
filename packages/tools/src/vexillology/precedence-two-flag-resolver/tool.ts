import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
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
  if (input.actualFlagLabels.length !== 2)
    simpleError("flags", "Exactlytwoactualflags.");
  aligned(
    input.actualFlagLabels,
    input.callerIndependentApplicablePrecedenceRanks,
    "ranks",
  );
  input.callerIndependentApplicablePrecedenceRanks.forEach((v) =>
    bounded(v, "rank", 0, 10000),
  );
  const a = input.callerIndependentApplicablePrecedenceRanks;
  return {
    orderedFlagGroups:
      a[0] === a[1]
        ? [input.actualFlagLabels.slice()]
        : a[0] < a[1]
          ? [[input.actualFlagLabels[0]], [input.actualFlagLabels[1]]]
          : [[input.actualFlagLabels[1]], [input.actualFlagLabels[0]]],
    hasUnresolvedEqualRank: a[0] === a[1],
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
    actualFlagLabels: ["a", "b"],
    callerIndependentApplicablePrecedenceRanks: [1, 1],
  },
  output: {
    result: { orderedFlagGroups: [["a", "b"]], hasUnresolvedEqualRank: true },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "vexillology/precedence-two-flag-resolver",
  title: "Precedence Order Rank Resolver (two flags)",
  description:
    "Twoactualflagindependently applicableprecedenceranksascending,unresolvedequalprioritygroupretained,no inferrednational precedence. Actual independently applicable flag/cloth/manufacturer/jurisdiction/protocol/sourceedition,units/calibration and observations external;not legal/display precedence,authenticity,visibility or structural safety approval.",
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
