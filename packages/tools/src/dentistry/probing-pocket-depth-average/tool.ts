import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative, mean } from "../batch47-shared.js";
export type Input = Readonly<{
  readonly independentlyMeasuredProbingDepthsMm: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyMeasuredProbingDepthsMm",
    label: "Independently measured probing depths mm",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  input.independentlyMeasuredProbingDepthsMm.forEach((v) =>
    nonnegative(v, "depth"),
  );
  return {
    observedMeanProbingDepthMm: mean(
      input.independentlyMeasuredProbingDepthsMm,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { independentlyMeasuredProbingDepthsMm: [2, 3, 4] },
  output: { result: { observedMeanProbingDepthMm: 3 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "dentistry/probing-pocket-depth-average",
  title: "Average Probing Pocket Depth Calculator",
  description:
    "Actual declared independently assessed periodontal probing-depth sites, arithmetic mean of sampled sites, not whole-mouth imputation or disease severity. Probe force, anatomy and site selection external.",
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
