import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
} from "../shared.js";
export type Input = Readonly<{
  readonly suppliedVerticalForcesN: readonly number[];
  readonly signedHorizontalMomentArmsM: readonly number[];
  readonly extensorMomentArmM: number;
  readonly callerAdditionalCompressiveForceN: number;
}>;
export type Output = Readonly<{
  readonly signedExternalL5S1MomentNm: number;
  readonly modelExtensorForceMagnitudeN: number;
  readonly modelAxialCompressionN: number;
}>;
const inputFields = [
  {
    id: "suppliedVerticalForcesN",
    label: "Supplied vertical forces n",
    kind: "numberList",
  },
  {
    id: "signedHorizontalMomentArmsM",
    label: "Signed horizontal moment arms m",
    kind: "numberList",
  },
  { id: "extensorMomentArmM", label: "Extensor moment arm m", kind: "number" },
  {
    id: "callerAdditionalCompressiveForceN",
    label: "Caller additional compressive force n",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.extensorMomentArmM, "extensorMomentArmM");
  nonnegative(
    input.callerAdditionalCompressiveForceN,
    "callerAdditionalCompressiveForceN",
  );
  aligned(
    input.suppliedVerticalForcesN,
    input.signedHorizontalMomentArmsM,
    "suppliedVerticalForcesN",
  );
  const m = input.suppliedVerticalForcesN.reduce(
      (s, v, i) => s + v * input.signedHorizontalMomentArmsM[i],
      0,
    ),
    ext = Math.abs(m) / input.extensorMomentArmM;
  return {
    signedExternalL5S1MomentNm: m,
    modelExtensorForceMagnitudeN: ext,
    modelAxialCompressionN:
      input.suppliedVerticalForcesN.reduce((s, v) => s + Math.abs(v), 0) +
      ext +
      input.callerAdditionalCompressiveForceN,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  suppliedVerticalForcesN: [100, 200],
  signedHorizontalMomentArmsM: [0.1, 0.2],
  extensorMomentArmM: 0.05,
  callerAdditionalCompressiveForceN: 50,
} satisfies Input;
export const exampleOutput = {
  signedExternalL5S1MomentNm: 50,
  modelExtensorForceMagnitudeN: 1000,
  modelAxialCompressionN: 1350,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "ergonomics/l5s1-moment-calculator",
  title: "Rapid Entire Body Compression Load L5S1 Moment Calculator",
  description:
    "Estimate signed L5/S1 static planar moment and simplified compression from explicitly supplied vertical force/lever-arm model and extensor arm; absolute axial loads and caller co-contraction term are assumptions, not anatomical diagnosis or safe load limit.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedExternalL5S1MomentNm",
      label: "Signed external l5 s1 moment nm",
      kind: "number",
    },
    {
      id: "modelExtensorForceMagnitudeN",
      label: "Model extensor force magnitude n",
      kind: "number",
    },
    {
      id: "modelAxialCompressionN",
      label: "Model axial compression n",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      suppliedVerticalForcesN:
        value.suppliedVerticalForcesN as readonly number[],
      signedHorizontalMomentArmsM:
        value.signedHorizontalMomentArmsM as readonly number[],
      extensorMomentArmM: value.extensorMomentArmM as number,
      callerAdditionalCompressiveForceN:
        value.callerAdditionalCompressiveForceN as number,
    }),
});
export const run = tool.execute;
export default tool;
