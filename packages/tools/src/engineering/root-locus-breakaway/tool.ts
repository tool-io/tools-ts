import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, rootStationary } from "../batch38-shared.js";
export type Input = Readonly<{
  readonly realOpenLoopPoles: readonly number[];
  readonly realOpenLoopZeros: readonly number[];
  readonly callerStationaryBracketLower: number;
  readonly callerStationaryBracketUpper: number;
}>;
export type Output = Readonly<{
  readonly stationaryPoint: number;
  readonly gain: number;
}>;
const inputFields = [
  {
    id: "realOpenLoopPoles",
    label: "Real open loop poles",
    kind: "numberList",
  },
  {
    id: "realOpenLoopZeros",
    label: "Real open loop zeros",
    kind: "numberList",
  },
  {
    id: "callerStationaryBracketLower",
    label: "Caller stationary bracket lower",
    kind: "number",
  },
  {
    id: "callerStationaryBracketUpper",
    label: "Caller stationary bracket upper",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return rootStationary(
    input.realOpenLoopPoles,
    input.realOpenLoopZeros,
    input.callerStationaryBracketLower,
    input.callerStationaryBracketUpper,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  realOpenLoopPoles: [0, -2],
  realOpenLoopZeros: [],
  callerStationaryBracketLower: -1.5,
  callerStationaryBracketUpper: -0.5,
} satisfies Input;
export const exampleOutput = { stationaryPoint: -1, gain: 1 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/root-locus-breakaway",
  title: "Root Locus Breakaway Calculator",
  description:
    "Bracketed real root-locus stationary gain for independently chosen pole/zero-free real branch, positive gain checked; not all complex breakaway roots or automatic branch membership. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    { id: "stationaryPoint", label: "Stationary point", kind: "number" },
    { id: "gain", label: "Gain", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      realOpenLoopPoles: value.realOpenLoopPoles as readonly number[],
      realOpenLoopZeros: value.realOpenLoopZeros as readonly number[],
      callerStationaryBracketLower:
        value.callerStationaryBracketLower as number,
      callerStationaryBracketUpper:
        value.callerStationaryBracketUpper as number,
    }),
});
export const run = tool.execute;
export default tool;
