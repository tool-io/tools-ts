import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly hamstringPeakTorqueNm: number;
  readonly quadricepsPeakTorqueNm: number;
  readonly ratioLower: number;
  readonly ratioUpper: number;
}>;
export type Output = Readonly<{
  readonly hamstringQuadricepsRatio: number;
  readonly withinRange: boolean;
}>;
export const calculate = (input: Input): Output => {
  if (
    input.hamstringPeakTorqueNm < 0 ||
    input.quadricepsPeakTorqueNm <= 0 ||
    input.ratioLower < 0 ||
    input.ratioUpper < input.ratioLower
  )
    simpleError(
      "quadricepsPeakTorqueNm",
      "Positive quadriceps torque and ordered ratio limits required.",
    );
  const hamstringQuadricepsRatio =
    input.hamstringPeakTorqueNm / input.quadricepsPeakTorqueNm;
  return {
    hamstringQuadricepsRatio,
    withinRange:
      hamstringQuadricepsRatio >= input.ratioLower &&
      hamstringQuadricepsRatio <= input.ratioUpper,
  };
};
export const exampleInput = {
  hamstringPeakTorqueNm: 120,
  quadricepsPeakTorqueNm: 200,
  ratioLower: 0.5,
  ratioUpper: 0.7,
} satisfies Input;
export const exampleOutput = {
  hamstringQuadricepsRatio: 0.6,
  withinRange: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "kinesiology/hamstring-quadriceps-ratio",
  title: "Hamstring Quadriceps Ratio",
  description:
    "Calculate isokinetic hamstring/quadriceps torque ratio against caller limits.",
  inputs: [
    {
      id: "hamstringPeakTorqueNm",
      label: "Hamstring peak torque nm",
      kind: "number",
    },
    {
      id: "quadricepsPeakTorqueNm",
      label: "Quadriceps peak torque nm",
      kind: "number",
    },
    { id: "ratioLower", label: "Ratio lower", kind: "number" },
    { id: "ratioUpper", label: "Ratio upper", kind: "number" },
  ],
  outputs: [
    {
      id: "hamstringQuadricepsRatio",
      label: "Hamstring quadriceps ratio",
      kind: "number",
    },
    { id: "withinRange", label: "Within range", kind: "boolean" },
  ],
  calculate: (value) =>
    calculate({
      hamstringPeakTorqueNm: value.hamstringPeakTorqueNm as number,
      quadricepsPeakTorqueNm: value.quadricepsPeakTorqueNm as number,
      ratioLower: value.ratioLower as number,
      ratioUpper: value.ratioUpper as number,
    }),
});
export const run = tool.execute;
export default tool;
