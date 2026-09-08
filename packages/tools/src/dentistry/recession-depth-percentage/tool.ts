import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch47-shared.js";
export type Input = Readonly<{
  readonly independentlyMeasuredRecessionDepthMm: number;
  readonly callerVerifiedMatchedReferenceRootLengthMm: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyMeasuredRecessionDepthMm",
    label: "Independently measured recession depth mm",
    kind: "number",
  },
  {
    id: "callerVerifiedMatchedReferenceRootLengthMm",
    label: "Caller verified matched reference root length mm",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(input.independentlyMeasuredRecessionDepthMm, "numerator");
  positive(input.callerVerifiedMatchedReferenceRootLengthMm, "denominator");
  return {
    observedRatio:
      (100 * input.independentlyMeasuredRecessionDepthMm) /
      input.callerVerifiedMatchedReferenceRootLengthMm,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyMeasuredRecessionDepthMm: 2,
    callerVerifiedMatchedReferenceRootLengthMm: 4,
  },
  output: { result: { observedRatio: 50.0 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "dentistry/recession-depth-percentage",
  title: "Recession Depth Percentage Calculator",
  description:
    "Actual recession/reference-root-length percent with explicitly declared reference, not a universal recession severity index. Independently measured compatible definitions/units required; ratio is not a diagnosis, efficacy measure or safety/clinical threshold.",
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
