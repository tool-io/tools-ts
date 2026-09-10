import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualBaselineDarkStateSeconds: number;
  readonly actualBaselineObservedSeconds: number;
  readonly actualTreatedDarkStateSeconds: number;
  readonly actualTreatedObservedSeconds: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualBaselineDarkStateSeconds",
    label: "Actual baseline dark state seconds",
    kind: "number",
  },
  {
    id: "actualBaselineObservedSeconds",
    label: "Actual baseline observed seconds",
    kind: "number",
  },
  {
    id: "actualTreatedDarkStateSeconds",
    label: "Actual treated dark state seconds",
    kind: "number",
  },
  {
    id: "actualTreatedObservedSeconds",
    label: "Actual treated observed seconds",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.actualBaselineObservedSeconds, "baseline-duration");
  positive(input.actualTreatedObservedSeconds, "treated-duration");
  if (
    input.actualBaselineDarkStateSeconds < 0 ||
    input.actualTreatedDarkStateSeconds < 0 ||
    input.actualBaselineDarkStateSeconds >
      input.actualBaselineObservedSeconds ||
    input.actualTreatedDarkStateSeconds > input.actualTreatedObservedSeconds
  )
    simpleError("inventory", "Actual dark periods within observed time.");
  return {
    signedObservedDarkFractionReduction:
      input.actualBaselineDarkStateSeconds /
        input.actualBaselineObservedSeconds -
      input.actualTreatedDarkStateSeconds / input.actualTreatedObservedSeconds,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualBaselineDarkStateSeconds: 4,
    actualBaselineObservedSeconds: 10,
    actualTreatedDarkStateSeconds: 1,
    actualTreatedObservedSeconds: 10,
  },
  output: { result: { signedObservedDarkFractionReduction: 0.3 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/quantum-dot-blinking-suppression",
  title: "Semiconductor Quantum Dot Blinking Suppression Calculator",
  description:
    "Actual independently classified quantum-dot dark-time fraction comparison, not guaranteed blinking suppression, causal treatment effect or exciton lifetime.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observed calculation or explicit reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
