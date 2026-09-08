import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative, sum } from "../batch47-shared.js";
export type Input = Readonly<{
  readonly actualRecordedPdlInjectionVolumesMl: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualRecordedPdlInjectionVolumesMl",
    label: "Actual recorded pdl injection volumes ml",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  input.actualRecordedPdlInjectionVolumesMl.forEach((v) =>
    nonnegative(v, "actual-volume"),
  );
  return {
    observedTotalPdlInjectionVolumeMl: sum(
      input.actualRecordedPdlInjectionVolumesMl,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualRecordedPdlInjectionVolumesMl: [0.1, 0.2] },
  output: { result: { observedTotalPdlInjectionVolumeMl: 0.3 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "dentistry/pdl-injection-volume",
  title: "PDL Injection Volume Calculator",
  description:
    "Actual PDLinjection volume inventory only, not suggested volume/site, pressure, clinical efficacy or safe injection instruction.",
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
