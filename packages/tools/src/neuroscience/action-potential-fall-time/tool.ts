import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, fractionalFall } from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualDescendingTimesMs: readonly number[];
  readonly actualDescendingVoltagesMv: readonly number[];
  readonly callerIndependentPeakMv: number;
  readonly callerIndependentBaselineMv: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualDescendingTimesMs",
    label: "Actual descending times ms",
    kind: "numberList",
  },
  {
    id: "actualDescendingVoltagesMv",
    label: "Actual descending voltages mv",
    kind: "numberList",
  },
  {
    id: "callerIndependentPeakMv",
    label: "Caller independent peak mv",
    kind: "number",
  },
  {
    id: "callerIndependentBaselineMv",
    label: "Caller independent baseline mv",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return {
    observedNinetyToTenFallTimeMs: fractionalFall(
      input.actualDescendingTimesMs,
      input.actualDescendingVoltagesMv,
      input.callerIndependentPeakMv,
      input.callerIndependentBaselineMv,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualDescendingTimesMs: [0, 1, 2],
    actualDescendingVoltagesMv: [10, 5, 0],
    callerIndependentPeakMv: 10,
    callerIndependentBaselineMv: 0,
  },
  output: { result: { observedNinetyToTenFallTimeMs: 1.6 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/action-potential-fall-time",
  title: "Action Potential Fall Time Calculator",
  description:
    "Actual monotone falling branch90to10percent peak baseline amplitude duration, linear adjacent interpolation, no extrapolation/plateau ambiguity; not whole action potential width or assume exponentially shaped decay.",
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
