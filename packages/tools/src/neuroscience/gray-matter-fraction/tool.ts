import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch47-shared.js";
export type Input = Readonly<{
  readonly independentlySegmentedGrayMatterMl: number;
  readonly independentlyMatchedIntracranialMl: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlySegmentedGrayMatterMl",
    label: "Independently segmented gray matter ml",
    kind: "number",
  },
  {
    id: "independentlyMatchedIntracranialMl",
    label: "Independently matched intracranial ml",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(input.independentlySegmentedGrayMatterMl, "numerator");
  positive(input.independentlyMatchedIntracranialMl, "denominator");
  return {
    observedRatio:
      (1 * input.independentlySegmentedGrayMatterMl) /
      input.independentlyMatchedIntracranialMl,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlySegmentedGrayMatterMl: 2,
    independentlyMatchedIntracranialMl: 4,
  },
  output: { result: { observedRatio: 0.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/gray-matter-fraction",
  title: "Gray Matter Fraction Calculator",
  description:
    "Actual same-mask segment/ICVfraction with qualified segmentation, not age norm or disease determination. Independently measured compatible definitions/units required; ratio is not a diagnosis, efficacy measure or safety/clinical threshold.",
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
