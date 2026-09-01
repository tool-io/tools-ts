import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  bounded,
  sum,
} from "../batch33-shared.js";
export type Input = Readonly<{
  readonly flatWidthM: number;
  readonly flatHeightM: number;
  readonly interiorToggleCount: number;
  readonly callerFrameFaceWidthM: number;
}>;
export type Output = Readonly<{
  readonly faceAreaM2: number;
  readonly verticalMemberLengthsM: readonly number[];
  readonly horizontalMemberLengthsM: readonly number[];
  readonly totalRequiredMemberLengthM: number;
}>;
const inputFields = [
  { id: "flatWidthM", label: "Flat width m", kind: "number" },
  { id: "flatHeightM", label: "Flat height m", kind: "number" },
  { id: "interiorToggleCount", label: "Interior toggle count", kind: "number" },
  {
    id: "callerFrameFaceWidthM",
    label: "Caller frame face width m",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.flatWidthM, "flatWidthM");
  positive(input.flatHeightM, "flatHeightM");
  positive(input.callerFrameFaceWidthM, "callerFrameFaceWidthM");
  bounded(input.interiorToggleCount, "toggles", 0, 100);
  const horizontal = input.flatWidthM - 2 * input.callerFrameFaceWidthM;
  if (horizontal <= 0)
    simpleError("frame", "Positive inside framing width required.");
  const h = Array<number>(input.interiorToggleCount + 2).fill(horizontal);
  return {
    faceAreaM2: input.flatWidthM * input.flatHeightM,
    verticalMemberLengthsM: [input.flatHeightM, input.flatHeightM],
    horizontalMemberLengthsM: h,
    totalRequiredMemberLengthM: 2 * input.flatHeightM + sum(h),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  flatWidthM: 2,
  flatHeightM: 3,
  interiorToggleCount: 2,
  callerFrameFaceWidthM: 0.1,
} satisfies Input;
export const exampleOutput = {
  faceAreaM2: 6,
  verticalMemberLengthsM: [3, 3],
  horizontalMemberLengthsM: [1.8, 1.8, 1.8, 1.8],
  totalRequiredMemberLengthM: 13.2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "theatre/size-flat-square-footage-lumber-count-calculator",
  title: "Size Flat Square Footage Lumber Count Calculator",
  description:
    "Inventory actual butt-jointed scenic-flat frame members from caller face width and explicit toggle count; output is cut lengths, not structural lumber selection, stock nesting, kerf or load certification.",
  inputs: inputFields,
  outputs: [
    { id: "faceAreaM2", label: "Face area m2", kind: "number" },
    {
      id: "verticalMemberLengthsM",
      label: "Vertical member lengths m",
      kind: "numberList",
    },
    {
      id: "horizontalMemberLengthsM",
      label: "Horizontal member lengths m",
      kind: "numberList",
    },
    {
      id: "totalRequiredMemberLengthM",
      label: "Total required member length m",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      flatWidthM: value.flatWidthM as number,
      flatHeightM: value.flatHeightM as number,
      interiorToggleCount: value.interiorToggleCount as number,
      callerFrameFaceWidthM: value.callerFrameFaceWidthM as number,
    }),
});
export const run = tool.execute;
export default tool;
