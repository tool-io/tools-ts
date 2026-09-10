import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch47-shared.js";
export type Input = Readonly<{
  readonly independentlySegmentedVentricularVolumeMl: number;
  readonly independentlyMatchedBrainParenchymalVolumeMl: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlySegmentedVentricularVolumeMl",
    label: "Independently segmented ventricular volume ml",
    kind: "number",
  },
  {
    id: "independentlyMatchedBrainParenchymalVolumeMl",
    label: "Independently matched brain parenchymal volume ml",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(input.independentlySegmentedVentricularVolumeMl, "numerator");
  positive(input.independentlyMatchedBrainParenchymalVolumeMl, "denominator");
  return {
    observedRatio:
      (1 * input.independentlySegmentedVentricularVolumeMl) /
      input.independentlyMatchedBrainParenchymalVolumeMl,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlySegmentedVentricularVolumeMl: 2,
    independentlyMatchedBrainParenchymalVolumeMl: 4,
  },
  output: { result: { observedRatio: 0.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/ventricle-brain-ratio",
  title: "Ventricle Brain Ratio Calculator",
  description:
    "Actual ventricle/parenchyma volume ratio, explicitly not ventricular/ICVfraction or diagnosis of hydrocephalus. Independently measured compatible definitions/units required; ratio is not a diagnosis, efficacy measure or safety/clinical threshold.",
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
