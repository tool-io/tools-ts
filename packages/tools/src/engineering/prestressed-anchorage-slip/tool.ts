import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly observedAnchorageDrawInM: number;
  readonly callerIndependentAffectedTendonLengthM: number;
  readonly prestressSteelModulusPa: number;
}>;
export type Output = Readonly<{
  readonly uniformAffectedAnchorageStressLossPa: number;
}>;
const inputFields = [
  {
    id: "observedAnchorageDrawInM",
    label: "Observed anchorage draw in m",
    kind: "number",
  },
  {
    id: "callerIndependentAffectedTendonLengthM",
    label: "Caller independent affected tendon length m",
    kind: "number",
  },
  {
    id: "prestressSteelModulusPa",
    label: "Prestress steel modulus pa",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.callerIndependentAffectedTendonLengthM,
    "callerIndependentAffectedTendonLengthM",
  );
  positive(input.prestressSteelModulusPa, "prestressSteelModulusPa");
  nonnegative(input.observedAnchorageDrawInM, "observedAnchorageDrawInM");
  return {
    uniformAffectedAnchorageStressLossPa:
      (input.prestressSteelModulusPa * input.observedAnchorageDrawInM) /
      input.callerIndependentAffectedTendonLengthM,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedAnchorageDrawInM: 0.001,
  callerIndependentAffectedTendonLengthM: 2,
  prestressSteelModulusPa: 100000,
} satisfies Input;
export const exampleOutput = {
  uniformAffectedAnchorageStressLossPa: 50,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/prestressed-anchorage-slip",
  title: "Anchorage Slip Prestress Loss Calculator",
  description:
    "Uniform elongation compatibility for independently established anchorage-slip affected length, not whole tendon length or automatic friction interaction. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "uniformAffectedAnchorageStressLossPa",
      label: "Uniform affected anchorage stress loss pa",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedAnchorageDrawInM: value.observedAnchorageDrawInM as number,
      callerIndependentAffectedTendonLengthM:
        value.callerIndependentAffectedTendonLengthM as number,
      prestressSteelModulusPa: value.prestressSteelModulusPa as number,
    }),
});
export const run = tool.execute;
export default tool;
