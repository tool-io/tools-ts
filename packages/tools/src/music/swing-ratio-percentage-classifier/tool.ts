import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, fraction } from "../shared.js";
export type Input = Readonly<{
  readonly measuredLongSubdivisionMs: number;
  readonly measuredShortSubdivisionMs: number;
  readonly callerStraightShareTolerance: number;
}>;
export type Output = Readonly<{
  readonly firstSubdivisionSharePercent: number;
  readonly longToShortSubdivisionRatio: number;
  readonly swingTimingClass: string;
}>;
const inputFields = [
  {
    id: "measuredLongSubdivisionMs",
    label: "Measured long subdivision ms",
    kind: "number",
  },
  {
    id: "measuredShortSubdivisionMs",
    label: "Measured short subdivision ms",
    kind: "number",
  },
  {
    id: "callerStraightShareTolerance",
    label: "Caller straight share tolerance",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.measuredLongSubdivisionMs, "measuredLongSubdivisionMs");
  positive(input.measuredShortSubdivisionMs, "measuredShortSubdivisionMs");
  fraction(input.callerStraightShareTolerance, "callerStraightShareTolerance");
  if (input.callerStraightShareTolerance >= 0.5)
    simpleError("tolerance", "Straight tolerance below half-cycle required.");
  const share =
    input.measuredLongSubdivisionMs /
    (input.measuredLongSubdivisionMs + input.measuredShortSubdivisionMs);
  return {
    firstSubdivisionSharePercent: 100 * share,
    longToShortSubdivisionRatio:
      input.measuredLongSubdivisionMs / input.measuredShortSubdivisionMs,
    swingTimingClass:
      Math.abs(share - 0.5) <= input.callerStraightShareTolerance
        ? "straight"
        : share > 0.5
          ? "long-short-swing"
          : "reverse-short-long",
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  measuredLongSubdivisionMs: 200,
  measuredShortSubdivisionMs: 100,
  callerStraightShareTolerance: 0.01,
} satisfies Input;
export const exampleOutput = {
  firstSubdivisionSharePercent: 66.66666666666667,
  longToShortSubdivisionRatio: 2,
  swingTimingClass: "long-short-swing",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "music/swing-ratio-percentage-classifier",
  title: "Swing Ratio Percentage Classifier",
  description:
    "Classify measured paired subdivision timing and exact share/ratio under caller straight tolerance; does not infer tempo dependence or prescribe fixed 2:1 swing.",
  inputs: inputFields,
  outputs: [
    {
      id: "firstSubdivisionSharePercent",
      label: "First subdivision share percent",
      kind: "number",
    },
    {
      id: "longToShortSubdivisionRatio",
      label: "Long to short subdivision ratio",
      kind: "number",
    },
    { id: "swingTimingClass", label: "Swing timing class", kind: "string" },
  ],
  calculate: (value) =>
    calculate({
      measuredLongSubdivisionMs: value.measuredLongSubdivisionMs as number,
      measuredShortSubdivisionMs: value.measuredShortSubdivisionMs as number,
      callerStraightShareTolerance:
        value.callerStraightShareTolerance as number,
    }),
});
export const run = tool.execute;
export default tool;
