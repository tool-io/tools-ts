import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch47-shared.js";
export type Input = Readonly<{
  readonly independentlyMeasuredBaselineProtocolExposure: number;
  readonly independentlyMeasuredChildProtocolExposure: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyMeasuredBaselineProtocolExposure",
    label: "Independently measured baseline protocol exposure",
    kind: "number",
  },
  {
    id: "independentlyMeasuredChildProtocolExposure",
    label: "Independently measured child protocol exposure",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.independentlyMeasuredBaselineProtocolExposure, "baseline");
  nonnegative(input.independentlyMeasuredChildProtocolExposure, "child");
  const r =
    input.independentlyMeasuredChildProtocolExposure /
    input.independentlyMeasuredBaselineProtocolExposure;
  return {
    observedChildToBaselineExposureFraction: r,
    observedExposureReductionPercent: 100 * (1 - r),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyMeasuredBaselineProtocolExposure: 10,
    independentlyMeasuredChildProtocolExposure: 4,
  },
  output: {
    result: {
      observedChildToBaselineExposureFraction: 0.4,
      observedExposureReductionPercent: 60,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "dentistry/child-x-ray-exposure-reduction",
  title: "Child X-Ray Exposure Reduction Factor Calculator",
  description:
    "Actual comparable child versus baseline protocol exposure, not a universal age-scaling factor, image-quality proof or recommended pediatric exposure. Dose quantity, phantom, geometry and equipment independently matched.",
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
