import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
  fraction,
  normalQuantile,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly callerTwoSidedAlpha: number;
  readonly callerIndependentExpectedEffectSize: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerTwoSidedAlpha",
    label: "Caller two sided alpha",
    kind: "number",
  },
  {
    id: "callerIndependentExpectedEffectSize",
    label: "Caller independent expected effect size",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  fraction(input.callerTwoSidedAlpha, "callerTwoSidedAlpha");
  positive(
    input.callerIndependentExpectedEffectSize,
    "callerIndependentExpectedEffectSize",
  );
  if (input.callerTwoSidedAlpha <= 0 || input.callerTwoSidedAlpha >= 1)
    simpleError("alpha", "Interioractualalpha.");
  return {
    value: Math.ceil(
      (2 *
        (normalQuantile(1 - input.callerTwoSidedAlpha / 2) +
          normalQuantile(0.8)) **
          2) /
        input.callerIndependentExpectedEffectSize ** 2,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerTwoSidedAlpha: 0.05,
    callerIndependentExpectedEffectSize: 0.5,
  },
  output: { result: { value: 63 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "psychology/sample-size-independent-t-power80",
  title: "Independent t-Test Power .80 Sample Size",
  description:
    "Explicit equal allocation independent two-sample NORMAL approximation per group80percent power budget; not exact noncentraltpower or observed-effect guarantee. Actual independently qualified instrument/cohort/matching units; no diagnosis, causal outcome, validated personal prediction or universal clinical cutoff.",
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
