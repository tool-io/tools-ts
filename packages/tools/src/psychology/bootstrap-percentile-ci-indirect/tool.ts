import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  fraction,
  quantile,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualBootstrapIndirectEffectReplicates: readonly number[];
  readonly callerCentralCoverageFraction: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualBootstrapIndirectEffectReplicates",
    label: "Actual bootstrap indirect effect replicates",
    kind: "numberList",
  },
  {
    id: "callerCentralCoverageFraction",
    label: "Caller central coverage fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  fraction(input.callerCentralCoverageFraction, "coverage");
  if (
    input.callerCentralCoverageFraction <= 0 ||
    input.callerCentralCoverageFraction >= 1
  )
    simpleError("coverage", "Centralcoverageinterior0…1.");
  return {
    observedPercentileLower: quantile(
      input.actualBootstrapIndirectEffectReplicates,
      (1 - input.callerCentralCoverageFraction) / 2,
    ),
    observedPercentileUpper: quantile(
      input.actualBootstrapIndirectEffectReplicates,
      (1 + input.callerCentralCoverageFraction) / 2,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualBootstrapIndirectEffectReplicates: [0, 1, 2, 3, 4],
    callerCentralCoverageFraction: 0.5,
  },
  output: {
    result: { observedPercentileLower: 1, observedPercentileUpper: 3 },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "psychology/bootstrap-percentile-ci-indirect",
  title: "Bootstrap Percentile CI Indirect Effect Calculator",
  description:
    "Actual independently resampled bootstrap indirect effect percentile CI with linear(order position) quantiles, not generate bootstrap replicates or infer BCa/causal significance.",
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
