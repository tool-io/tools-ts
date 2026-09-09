import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  nonnegative,
} from "../batch47-shared.js";
export type Input = Readonly<{
  readonly independentlyEstablishedSilentPeriodStartMs: number;
  readonly independentlyEstablishedSilentPeriodEndMs: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyEstablishedSilentPeriodStartMs",
    label: "Independently established silent period start ms",
    kind: "number",
  },
  {
    id: "independentlyEstablishedSilentPeriodEndMs",
    label: "Independently established silent period end ms",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(input.independentlyEstablishedSilentPeriodStartMs, "start");
  if (
    input.independentlyEstablishedSilentPeriodEndMs <
    input.independentlyEstablishedSilentPeriodStartMs
  )
    simpleError("period", "Actual end not before start.");
  return {
    observedCorticalSilentPeriodDurationMs:
      input.independentlyEstablishedSilentPeriodEndMs -
      input.independentlyEstablishedSilentPeriodStartMs,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyEstablishedSilentPeriodStartMs: 10,
    independentlyEstablishedSilentPeriodEndMs: 100,
  },
  output: { result: { observedCorticalSilentPeriodDurationMs: 90 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/cortical-silent-period-duration",
  title: "Cortical Silent Period Duration Calculator",
  description:
    "Actual independently clinically/research identified cortical silent-period boundaries after stated stimulus. Thresholding, task, EMGand component selection external; not an automatically detected silence or inhibition diagnosis.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observation, conditional calculation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
