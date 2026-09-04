import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, bounded, nyquist } from "../batch38-shared.js";
export type Input = Readonly<{
  readonly closedNyquistReal: readonly number[];
  readonly closedNyquistImaginary: readonly number[];
  readonly callerKnownOpenLoopRhpPoleCount: number;
  readonly callerFullContourAdequatelySampledVerified: boolean;
}>;
export type Output = Readonly<{
  readonly sampledCounterclockwiseCriticalWinding: number;
  readonly argumentPrincipleClosedLoopRhpZeros: number;
}>;
const inputFields = [
  { id: "closedNyquistReal", label: "Closed nyquist real", kind: "numberList" },
  {
    id: "closedNyquistImaginary",
    label: "Closed nyquist imaginary",
    kind: "numberList",
  },
  {
    id: "callerKnownOpenLoopRhpPoleCount",
    label: "Caller known open loop rhp pole count",
    kind: "number",
  },
  {
    id: "callerFullContourAdequatelySampledVerified",
    label: "Caller full contour adequately sampled verified",
    kind: "boolean",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  bounded(input.callerKnownOpenLoopRhpPoleCount, "RHP poles", 0, 100);
  if (!input.callerFullContourAdequatelySampledVerified)
    simpleError(
      "contour",
      "Independent complete positively oriented contour including all detours and adequate sampling required.",
    );
  const winding = nyquist(
    input.closedNyquistReal,
    input.closedNyquistImaginary,
  );
  return {
    sampledCounterclockwiseCriticalWinding: winding,
    argumentPrincipleClosedLoopRhpZeros: bounded(
      input.callerKnownOpenLoopRhpPoleCount + winding,
      "argument-principle nonnegative zero count",
      0,
      10000,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  closedNyquistReal: [0, -1, -2, -1, 0],
  closedNyquistImaginary: [0, 1, 0, -1, 0],
  callerKnownOpenLoopRhpPoleCount: 0,
  callerFullContourAdequatelySampledVerified: true,
} satisfies Input;
export const exampleOutput = {
  sampledCounterclockwiseCriticalWinding: 1,
  argumentPrincipleClosedLoopRhpZeros: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/nyquist-stability",
  title: "Nyquist Stability Calculator",
  description:
    "Argument principle sampled positively oriented full contour winding around−1, Z=P+counterclockwise winding; no stability assertion from a partial frequency plot. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "sampledCounterclockwiseCriticalWinding",
      label: "Sampled counterclockwise critical winding",
      kind: "number",
    },
    {
      id: "argumentPrincipleClosedLoopRhpZeros",
      label: "Argument principle closed loop rhp zeros",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      closedNyquistReal: value.closedNyquistReal as readonly number[],
      closedNyquistImaginary: value.closedNyquistImaginary as readonly number[],
      callerKnownOpenLoopRhpPoleCount:
        value.callerKnownOpenLoopRhpPoleCount as number,
      callerFullContourAdequatelySampledVerified:
        value.callerFullContourAdequatelySampledVerified as boolean,
    }),
});
export const run = tool.execute;
export default tool;
