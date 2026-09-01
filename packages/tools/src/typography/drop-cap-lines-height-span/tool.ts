import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, count } from "../shared.js";
export type Input = Readonly<{
  readonly dropCapLineCount: number;
  readonly bodyBaselineStepPx: number;
  readonly bodyCapHeightPx: number;
  readonly dropCapCapHeightRatio: number;
}>;
export type Output = Readonly<{
  readonly targetDropCapInkHeightPx: number;
  readonly requiredDropCapEmSizePx: number;
}>;
const inputFields = [
  { id: "dropCapLineCount", label: "Drop cap line count", kind: "number" },
  { id: "bodyBaselineStepPx", label: "Body baseline step px", kind: "number" },
  { id: "bodyCapHeightPx", label: "Body cap height px", kind: "number" },
  {
    id: "dropCapCapHeightRatio",
    label: "Drop cap cap height ratio",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.dropCapLineCount, "dropCapLineCount");
  positive(input.bodyBaselineStepPx, "bodyBaselineStepPx");
  positive(input.bodyCapHeightPx, "bodyCapHeightPx");
  positive(input.dropCapCapHeightRatio, "dropCapCapHeightRatio");
  count(input.dropCapLineCount, "dropCapLineCount");
  if (input.dropCapCapHeightRatio > 2)
    simpleError("metric", "Bounded cap-height/em ratio ≤2 required.");
  return {
    targetDropCapInkHeightPx:
      (input.dropCapLineCount - 1) * input.bodyBaselineStepPx +
      input.bodyCapHeightPx,
    requiredDropCapEmSizePx:
      ((input.dropCapLineCount - 1) * input.bodyBaselineStepPx +
        input.bodyCapHeightPx) /
      input.dropCapCapHeightRatio,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  dropCapLineCount: 3,
  bodyBaselineStepPx: 20,
  bodyCapHeightPx: 10,
  dropCapCapHeightRatio: 0.7,
} satisfies Input;
export const exampleOutput = {
  targetDropCapInkHeightPx: 50,
  requiredDropCapEmSizePx: 71.42857142857143,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "typography/drop-cap-lines-height-span",
  title: "Drop Cap Lines Height Span",
  description:
    "Align drop-cap ink top to body cap top over N−1 baseline intervals and derive em from actual cap-height ratio; not N times line-height or a recommended drop-cap size.",
  inputs: inputFields,
  outputs: [
    {
      id: "targetDropCapInkHeightPx",
      label: "Target drop cap ink height px",
      kind: "number",
    },
    {
      id: "requiredDropCapEmSizePx",
      label: "Required drop cap em size px",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      dropCapLineCount: value.dropCapLineCount as number,
      bodyBaselineStepPx: value.bodyBaselineStepPx as number,
      bodyCapHeightPx: value.bodyCapHeightPx as number,
      dropCapCapHeightRatio: value.dropCapCapHeightRatio as number,
    }),
});
export const run = tool.execute;
export default tool;
