import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative, sum } from "../batch46-shared.js";
export type Input = Readonly<{
  readonly independentlyVerifiedAvRuntimesMinutes: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyVerifiedAvRuntimesMinutes",
    label: "Independently verified av runtimes minutes",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  input.independentlyVerifiedAvRuntimesMinutes.forEach((v) =>
    nonnegative(v, "runtime"),
  );
  return {
    observedTotalRuntimeHours:
      sum(input.independentlyVerifiedAvRuntimesMinutes) / 60,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { independentlyVerifiedAvRuntimesMinutes: [30, 60, 90] },
  output: { result: { observedTotalRuntimeHours: 3 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "archival-studies/av-runtime-hours-summator",
  title: "Audiovisual Runtime Minutes to Hours Summator",
  description:
    "Sum actual independently verified AV item runtime minutes to hours, not playback workload when parallel processing, missing durations or duplicated items unresolved.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
