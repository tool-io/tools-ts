import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly callerShrinkageCurvaturePerM: number;
  readonly spanM: number;
  readonly callerCurvatureDeflectionCoefficient: number;
}>;
export type Output = Readonly<{ readonly signedShrinkageDeflectionM: number }>;
const inputFields = [
  {
    id: "callerShrinkageCurvaturePerM",
    label: "Caller shrinkage curvature per m",
    kind: "number",
  },
  { id: "spanM", label: "Span m", kind: "number" },
  {
    id: "callerCurvatureDeflectionCoefficient",
    label: "Caller curvature deflection coefficient",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.spanM, "spanM");
  nonnegative(
    input.callerCurvatureDeflectionCoefficient,
    "callerCurvatureDeflectionCoefficient",
  );
  return {
    signedShrinkageDeflectionM:
      input.callerShrinkageCurvaturePerM *
      input.spanM ** 2 *
      input.callerCurvatureDeflectionCoefficient,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerShrinkageCurvaturePerM: 0.01,
  spanM: 10,
  callerCurvatureDeflectionCoefficient: 0.125,
} satisfies Input;
export const exampleOutput = {
  signedShrinkageDeflectionM: 0.125,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/shrinkage-deflection",
  title: "Shrinkage Deflection Calculator",
  description:
    "Deflection from independent shrinkage curvature and actual support/curvature influence coefficient, not thermal expansion or creep multiplier. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedShrinkageDeflectionM",
      label: "Signed shrinkage deflection m",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerShrinkageCurvaturePerM:
        value.callerShrinkageCurvaturePerM as number,
      spanM: value.spanM as number,
      callerCurvatureDeflectionCoefficient:
        value.callerCurvatureDeflectionCoefficient as number,
    }),
});
export const run = tool.execute;
export default tool;
