import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly positionsM: readonly number[];
  readonly maximumSubsidenceM: number;
  readonly troughScaleM: number;
}>;
export type Output = Readonly<{ readonly signedTiltsMPerM: readonly number[] }>;
const inputFields = [
  { id: "positionsM", label: "Positions m", kind: "numberList" },
  { id: "maximumSubsidenceM", label: "Maximum subsidence m", kind: "number" },
  { id: "troughScaleM", label: "Trough scale m", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.troughScaleM, "troughScaleM");
  nonnegative(input.maximumSubsidenceM, "maximumSubsidenceM");
  if (!input.positionsM.length)
    simpleError("positionsM", "Nonempty positions required.");
  return {
    signedTiltsMPerM: input.positionsM.map((x) => {
      const z = x / input.troughScaleM;
      return (
        (-input.maximumSubsidenceM / input.troughScaleM) *
        z *
        Math.exp((-z * z) / 2)
      );
    }),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  positionsM: [-10, 0, 10],
  maximumSubsidenceM: 1,
  troughScaleM: 10,
} satisfies Input;
export const exampleOutput = {
  signedTiltsMPerM: [0.06065306597126334, 0, -0.06065306597126334],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/subsidence-tilt",
  title: "Subsidence Tilt",
  description:
    "Evaluate spatial derivative of supplied downward-positive Gaussian trough; distinct from horizontal strain and excludes building response.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedTiltsMPerM",
      label: "Signed tilts m per m",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      positionsM: value.positionsM as readonly number[],
      maximumSubsidenceM: value.maximumSubsidenceM as number,
      troughScaleM: value.troughScaleM as number,
    }),
});
export const run = tool.execute;
export default tool;
