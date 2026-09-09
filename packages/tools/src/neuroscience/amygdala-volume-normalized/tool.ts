import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch47-shared.js";
export type Input = Readonly<{
  readonly independentlySegmentedBilateralAmygdalaVolumeMl: number;
  readonly independentlyMatchedIntracranialVolumeMl: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlySegmentedBilateralAmygdalaVolumeMl",
    label: "Independently segmented bilateral amygdala volume ml",
    kind: "number",
  },
  {
    id: "independentlyMatchedIntracranialVolumeMl",
    label: "Independently matched intracranial volume ml",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(
    input.independentlySegmentedBilateralAmygdalaVolumeMl,
    "numerator",
  );
  positive(input.independentlyMatchedIntracranialVolumeMl, "denominator");
  return {
    observedRatio:
      (1 * input.independentlySegmentedBilateralAmygdalaVolumeMl) /
      input.independentlyMatchedIntracranialVolumeMl,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlySegmentedBilateralAmygdalaVolumeMl: 2,
    independentlyMatchedIntracranialVolumeMl: 4,
  },
  output: { result: { observedRatio: 0.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/amygdala-volume-normalized",
  title: "Normalized Amygdala Volume Calculator",
  description:
    "Actual bilateral amygdala/ICVfraction with independently matched segmentation convention, not hippocampal adjustment or clinical size norm. Independently measured compatible definitions/units required; ratio is not a diagnosis, efficacy measure or safety/clinical threshold.",
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
