import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative, sum } from "../batch47-shared.js";
export type Input = Readonly<{
  readonly independentlyMeasuredDisjointFluidVolumesMl: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyMeasuredDisjointFluidVolumesMl",
    label: "Independently measured disjoint fluid volumes ml",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  input.independentlyMeasuredDisjointFluidVolumesMl.forEach((v) =>
    nonnegative(v, "volume"),
  );
  return {
    observedTotalFluidVolumeMl: sum(
      input.independentlyMeasuredDisjointFluidVolumesMl,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { independentlyMeasuredDisjointFluidVolumesMl: [100, 200] },
  output: { result: { observedTotalFluidVolumeMl: 300 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pregnancy/amniotic-fluid-volume-total",
  title: "Total Amniotic Fluid Volume Calculator",
  description:
    "Actual independently measured disjoint amniotic-fluid volumes in mL, not AFI/pocket-depth-to-volume conversion, universal ultrasound model or clinical assessment.",
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
