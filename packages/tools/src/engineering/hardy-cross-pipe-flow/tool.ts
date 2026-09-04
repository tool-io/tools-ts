import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, hardy } from "../batch38-shared.js";
export type Input = Readonly<{
  readonly signedLoopFlowsM3Second: readonly number[];
  readonly callerLoopResistance: readonly number[];
  readonly callerHeadLossExponents: readonly number[];
}>;
export type Output = Readonly<{
  readonly oneHardyCrossCorrectionM3Second: number;
  readonly correctedSingleLoopFlowsM3Second: readonly number[];
}>;
const inputFields = [
  {
    id: "signedLoopFlowsM3Second",
    label: "Signed loop flows m3 second",
    kind: "numberList",
  },
  {
    id: "callerLoopResistance",
    label: "Caller loop resistance",
    kind: "numberList",
  },
  {
    id: "callerHeadLossExponents",
    label: "Caller head loss exponents",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const correction = hardy(
    input.signedLoopFlowsM3Second,
    input.callerLoopResistance,
    input.callerHeadLossExponents,
  );
  return {
    oneHardyCrossCorrectionM3Second: correction,
    correctedSingleLoopFlowsM3Second: input.signedLoopFlowsM3Second.map(
      (v) => v + correction,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  signedLoopFlowsM3Second: [2, -1],
  callerLoopResistance: [1, 1],
  callerHeadLossExponents: [2, 2],
} satisfies Input;
export const exampleOutput = {
  oneHardyCrossCorrectionM3Second: -0.5,
  correctedSingleLoopFlowsM3Second: [1.5, -1.5],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/hardy-cross-pipe-flow",
  title: "Hardy Cross Pipe Flow Calculator",
  description:
    "Exactly one oriented single-loop Hardy Cross iteration, not shared-pipe network convergence or automatic balanced boundary flows. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "oneHardyCrossCorrectionM3Second",
      label: "One hardy cross correction m3 second",
      kind: "number",
    },
    {
      id: "correctedSingleLoopFlowsM3Second",
      label: "Corrected single loop flows m3 second",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      signedLoopFlowsM3Second:
        value.signedLoopFlowsM3Second as readonly number[],
      callerLoopResistance: value.callerLoopResistance as readonly number[],
      callerHeadLossExponents:
        value.callerHeadLossExponents as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
