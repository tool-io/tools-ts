import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError } from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualIndependentlyAssignedResponseClusterLabels: readonly string[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualIndependentlyAssignedResponseClusterLabels",
    label: "Actual independently assigned response cluster labels",
    kind: "stringList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (
    !input.actualIndependentlyAssignedResponseClusterLabels.length ||
    input.actualIndependentlyAssignedResponseClusterLabels.some(
      (v) => !v.trim(),
    )
  )
    simpleError(
      "labels",
      "Actual independently assigned eligible cluster labels.",
    );
  return {
    observedAdjacentClusterSwitchCount:
      input.actualIndependentlyAssignedResponseClusterLabels
        .slice(1)
        .filter(
          (v, i) =>
            v !== input.actualIndependentlyAssignedResponseClusterLabels[i],
        ).length,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualIndependentlyAssignedResponseClusterLabels: ["a", "a", "b", "a"],
  },
  output: { result: { observedAdjacentClusterSwitchCount: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "psychology/verbal-fluency-category-switching-index",
  title: "Verbal Fluency Switching Index Calculator",
  description:
    "Actual qualified adjacent verbal fluency cluster label switches, not automatic semantic cluster assignment, norm or inclusion of invalid responses.",
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
