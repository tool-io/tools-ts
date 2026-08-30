import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  aligned,
  ordered,
} from "../shared.js";
export type Input = Readonly<{
  readonly timesSeconds: readonly number[];
  readonly depthsM: readonly number[];
  readonly callerDescentSpeedBoundsMPerSecond: readonly number[];
  readonly callerMaximumSpeedChangeMPerSecond: number;
}>;
export type Output = Readonly<{
  readonly intervalDescentSpeedsMPerSecond: readonly number[];
  readonly outOfBandIntervalFlags: readonly number[];
  readonly speedJumpFlags: readonly number[];
}>;
const inputFields = [
  { id: "timesSeconds", label: "Times seconds", kind: "numberList" },
  { id: "depthsM", label: "Depths m", kind: "numberList" },
  {
    id: "callerDescentSpeedBoundsMPerSecond",
    label: "Caller descent speed bounds m per second",
    kind: "numberList",
  },
  {
    id: "callerMaximumSpeedChangeMPerSecond",
    label: "Caller maximum speed change m per second",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.depthsM.forEach((v) => nonnegative(v, "depthsM"));
  nonnegative(
    input.callerMaximumSpeedChangeMPerSecond,
    "callerMaximumSpeedChangeMPerSecond",
  );
  aligned(input.timesSeconds, input.depthsM, "timesSeconds");
  ordered(input.timesSeconds, "timesSeconds");
  if (
    input.callerDescentSpeedBoundsMPerSecond.length !== 2 ||
    input.callerDescentSpeedBoundsMPerSecond[0] >
      input.callerDescentSpeedBoundsMPerSecond[1]
  )
    simpleError("bounds", "Ordered two-bound signed speed band required.");
  const intervalDescentSpeedsMPerSecond = input.depthsM
      .slice(1)
      .map(
        (v, i) =>
          (v - input.depthsM[i]) /
          (input.timesSeconds[i + 1] - input.timesSeconds[i]),
      ),
    [lo, hi] = input.callerDescentSpeedBoundsMPerSecond;
  return {
    intervalDescentSpeedsMPerSecond,
    outOfBandIntervalFlags: intervalDescentSpeedsMPerSecond.map((v) =>
      v < lo || v > hi ? 1 : 0,
    ),
    speedJumpFlags: intervalDescentSpeedsMPerSecond
      .slice(1)
      .map((v, i) =>
        Math.abs(v - intervalDescentSpeedsMPerSecond[i]) >
        input.callerMaximumSpeedChangeMPerSecond
          ? 1
          : 0,
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  timesSeconds: [0, 1, 2],
  depthsM: [0, 1, 5],
  callerDescentSpeedBoundsMPerSecond: [0.5, 2],
  callerMaximumSpeedChangeMPerSecond: 2,
} satisfies Input;
export const exampleOutput = {
  intervalDescentSpeedsMPerSecond: [1, 4],
  outOfBandIntervalFlags: [0, 1],
  speedJumpFlags: [1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "oceanography/ctd-descend-rate-consistency-checker",
  title: "CTD Descend Rate Consistency Checker",
  description:
    "Audit observed CTD signed descent rates and adjacent speed jumps against caller acquisition policy; flags do not automatically identify sensor lag or discard data.",
  inputs: inputFields,
  outputs: [
    {
      id: "intervalDescentSpeedsMPerSecond",
      label: "Interval descent speeds m per second",
      kind: "numberList",
    },
    {
      id: "outOfBandIntervalFlags",
      label: "Out of band interval flags",
      kind: "numberList",
    },
    { id: "speedJumpFlags", label: "Speed jump flags", kind: "numberList" },
  ],
  calculate: (value) =>
    calculate({
      timesSeconds: value.timesSeconds as readonly number[],
      depthsM: value.depthsM as readonly number[],
      callerDescentSpeedBoundsMPerSecond:
        value.callerDescentSpeedBoundsMPerSecond as readonly number[],
      callerMaximumSpeedChangeMPerSecond:
        value.callerMaximumSpeedChangeMPerSecond as number,
    }),
});
export const run = tool.execute;
export default tool;
