import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
  fraction,
  normalQuantile,
} from "../batch50-shared.js";
export type Input = Readonly<{
  readonly callerTwoSidedAlpha: number;
  readonly callerPilotStandardDeviation: number;
  readonly callerIndependentlySpecifiedMeanErrorMargin: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerTwoSidedAlpha",
    label: "Caller two sided alpha",
    kind: "number",
  },
  {
    id: "callerPilotStandardDeviation",
    label: "Caller pilot standard deviation",
    kind: "number",
  },
  {
    id: "callerIndependentlySpecifiedMeanErrorMargin",
    label: "Caller independently specified mean error margin",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  fraction(input.callerTwoSidedAlpha, "callerTwoSidedAlpha");
  positive(input.callerPilotStandardDeviation, "callerPilotStandardDeviation");
  positive(
    input.callerIndependentlySpecifiedMeanErrorMargin,
    "callerIndependentlySpecifiedMeanErrorMargin",
  );
  if (input.callerTwoSidedAlpha <= 0 || input.callerTwoSidedAlpha >= 1)
    simpleError("alpha", "Interioralpha.");
  return {
    value: Math.ceil(
      (normalQuantile(1 - input.callerTwoSidedAlpha / 2) ** 2 *
        input.callerPilotStandardDeviation ** 2) /
        input.callerIndependentlySpecifiedMeanErrorMargin ** 2,
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
    callerPilotStandardDeviation: 2,
    callerIndependentlySpecifiedMeanErrorMargin: 1,
  },
  output: { result: { value: 16 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "aquaculture/sampling-size-estimation",
  title: "Sampling Size Estimation Calculator",
  description:
    "Prospective independently specified normal approximation mean sample budget ceil(z\u00b2\u03c3\u00b2/E\u00b2), independent animals/random sampling/variance assumptions; not finite population, t-distribution or cure selection.",
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
