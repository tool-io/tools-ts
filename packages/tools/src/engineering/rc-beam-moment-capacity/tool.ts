import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch38-shared.js";
export type Input = Readonly<{
  readonly tensionSteelAreaM2: number;
  readonly callerSteelYieldPa: number;
  readonly callerConcreteBlockStressPa: number;
  readonly sectionWidthM: number;
  readonly effectiveDepthM: number;
  readonly callerTensionYieldBranchVerified: boolean;
}>;
export type Output = Readonly<{
  readonly equivalentCompressionBlockDepthM: number;
  readonly nominalRcMomentNm: number;
}>;
const inputFields = [
  { id: "tensionSteelAreaM2", label: "Tension steel area m2", kind: "number" },
  { id: "callerSteelYieldPa", label: "Caller steel yield pa", kind: "number" },
  {
    id: "callerConcreteBlockStressPa",
    label: "Caller concrete block stress pa",
    kind: "number",
  },
  { id: "sectionWidthM", label: "Section width m", kind: "number" },
  { id: "effectiveDepthM", label: "Effective depth m", kind: "number" },
  {
    id: "callerTensionYieldBranchVerified",
    label: "Caller tension yield branch verified",
    kind: "boolean",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.tensionSteelAreaM2, "tensionSteelAreaM2");
  positive(input.callerSteelYieldPa, "callerSteelYieldPa");
  positive(input.callerConcreteBlockStressPa, "callerConcreteBlockStressPa");
  positive(input.sectionWidthM, "sectionWidthM");
  positive(input.effectiveDepthM, "effectiveDepthM");
  if (!input.callerTensionYieldBranchVerified)
    simpleError(
      "strain",
      "Independent singly reinforced tension-yield branch verification required.",
    );
  const a =
    (input.tensionSteelAreaM2 * input.callerSteelYieldPa) /
    input.callerConcreteBlockStressPa /
    input.sectionWidthM;
  if (a >= input.effectiveDepthM)
    simpleError("block", "Compression block depth<effective depth.");
  return {
    equivalentCompressionBlockDepthM: a,
    nominalRcMomentNm:
      input.tensionSteelAreaM2 *
      input.callerSteelYieldPa *
      (input.effectiveDepthM - a / 2),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  tensionSteelAreaM2: 0.01,
  callerSteelYieldPa: 100,
  callerConcreteBlockStressPa: 10,
  sectionWidthM: 1,
  effectiveDepthM: 1,
  callerTensionYieldBranchVerified: true,
} satisfies Input;
export const exampleOutput = {
  equivalentCompressionBlockDepthM: 0.1,
  nominalRcMomentNm: 0.95,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/rc-beam-moment-capacity",
  title: "RC Beam Moment Capacity Calculator",
  description:
    "Force-balanced caller uniform concrete block and independently verified yielded steel; no strength-reduction factor or strain classification assumed. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "equivalentCompressionBlockDepthM",
      label: "Equivalent compression block depth m",
      kind: "number",
    },
    { id: "nominalRcMomentNm", label: "Nominal rc moment nm", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      tensionSteelAreaM2: value.tensionSteelAreaM2 as number,
      callerSteelYieldPa: value.callerSteelYieldPa as number,
      callerConcreteBlockStressPa: value.callerConcreteBlockStressPa as number,
      sectionWidthM: value.sectionWidthM as number,
      effectiveDepthM: value.effectiveDepthM as number,
      callerTensionYieldBranchVerified:
        value.callerTensionYieldBranchVerified as boolean,
    }),
});
export const run = tool.execute;
export default tool;
