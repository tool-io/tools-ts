import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly callerIndependentlySpecifiedBoltPreloadNewtons: number;
  readonly actualNominalBoltDiameterMeters: number;
  readonly callerIndependentlyCalibratedTorqueNutFactor: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerIndependentlySpecifiedBoltPreloadNewtons",
    label: "Caller independently specified bolt preload newtons",
    kind: "number",
  },
  {
    id: "actualNominalBoltDiameterMeters",
    label: "Actual nominal bolt diameter meters",
    kind: "number",
  },
  {
    id: "callerIndependentlyCalibratedTorqueNutFactor",
    label: "Caller independently calibrated torque nut factor",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(input.callerIndependentlySpecifiedBoltPreloadNewtons, "preload");
  positive(input.actualNominalBoltDiameterMeters, "diameter");
  positive(input.callerIndependentlyCalibratedTorqueNutFactor, "K");
  return {
    conditionalNutFactorTorqueNewtonMeters:
      input.callerIndependentlySpecifiedBoltPreloadNewtons *
      input.actualNominalBoltDiameterMeters *
      input.callerIndependentlyCalibratedTorqueNutFactor,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerIndependentlySpecifiedBoltPreloadNewtons: 100,
    actualNominalBoltDiameterMeters: 0.01,
    callerIndependentlyCalibratedTorqueNutFactor: 0.2,
  },
  output: { result: { conditionalNutFactorTorqueNewtonMeters: 0.2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/bolt-preload-torque",
  title: "Bolt Preload Torque Calculator",
  description:
    "Conditional nutfactorT=KF d, actual independently specified preload, diameter and calibrated lubrication/thread factor. Not infer required preload, torque tension uncertainty, proof load or safe joint design.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observed calculation or explicit reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
