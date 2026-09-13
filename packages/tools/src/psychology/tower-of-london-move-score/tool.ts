import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualObservedMoveCount: number;
  readonly callerIndependentlyEstablishedMinimumMoveCount: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualObservedMoveCount",
    label: "Actual observed move count",
    kind: "number",
  },
  {
    id: "callerIndependentlyEstablishedMinimumMoveCount",
    label: "Caller independently established minimum move count",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  bounded(input.actualObservedMoveCount, "actualObservedMoveCount", 0, 1000000);
  bounded(
    input.callerIndependentlyEstablishedMinimumMoveCount,
    "callerIndependentlyEstablishedMinimumMoveCount",
    0,
    1000000,
  );
  return {
    value:
      input.actualObservedMoveCount -
      input.callerIndependentlyEstablishedMinimumMoveCount,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualObservedMoveCount: 5,
    callerIndependentlyEstablishedMinimumMoveCount: 3,
  },
  output: { result: { value: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "psychology/tower-of-london-move-score",
  title: "Tower of London Move Score Calculator",
  description:
    "Actual TowerofLondonexcess moves versus independently established minimum, negative flags are mismatch not correction; task definition/success and norms external. Actual independently qualified instrument/cohort/matching units; no diagnosis, causal outcome, validated personal prediction or universal clinical cutoff.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
