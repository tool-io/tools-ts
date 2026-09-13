import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
  sum,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualIndependentStudyZScores: readonly number[];
  readonly callerMatchedNormalCriticalValue: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualIndependentStudyZScores",
    label: "Actual independent study z scores",
    kind: "numberList",
  },
  {
    id: "callerMatchedNormalCriticalValue",
    label: "Caller matched normal critical value",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (!input.actualIndependentStudyZScores.length)
    simpleError(
      "actualIndependentStudyZScores",
      "Actual nonempty observations.",
    );
  positive(
    input.callerMatchedNormalCriticalValue,
    "callerMatchedNormalCriticalValue",
  );
  return {
    value:
      sum(input.actualIndependentStudyZScores) ** 2 /
        input.callerMatchedNormalCriticalValue ** 2 -
      input.actualIndependentStudyZScores.length,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualIndependentStudyZScores: [1, 2],
    callerMatchedNormalCriticalValue: 1.7320508075688772,
  },
  output: { result: { value: 1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "psychology/fail-safe-n-file-drawer",
  title: "Fail-Safe N File Drawer Calculator",
  description:
    "Rosenthal fail-safeNformula(sumZ)\u00b2/zcritical\u00b2\u2212kwith independently consistent one/two sided significance convention. Signed estimates retained, not publication bias proof or robust missing study inference. Actual independently qualified instrument/cohort/matching units; no diagnosis, causal outcome, validated personal prediction or universal clinical cutoff.",
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
