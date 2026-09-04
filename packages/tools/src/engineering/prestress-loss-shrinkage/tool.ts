import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly callerMatchedShrinkageStrain: number;
  readonly callerAlreadyAccountedShrinkageStrain: number;
  readonly prestressingSteelModulusPa: number;
  readonly callerStageTransferFraction: number;
}>;
export type Output = Readonly<{ readonly stagePrestressStressLossPa: number }>;
const inputFields = [
  {
    id: "callerMatchedShrinkageStrain",
    label: "Caller matched shrinkage strain",
    kind: "number",
  },
  {
    id: "prestressingSteelModulusPa",
    label: "Prestressing steel modulus pa",
    kind: "number",
  },
  {
    id: "callerAlreadyAccountedShrinkageStrain",
    label: "Caller already accounted shrinkage strain",
    kind: "number",
  },
  {
    id: "callerStageTransferFraction",
    label: "Caller stage transfer fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.prestressingSteelModulusPa, "prestressingSteelModulusPa");
  nonnegative(
    input.callerMatchedShrinkageStrain,
    "callerMatchedShrinkageStrain",
  );
  fraction(input.callerStageTransferFraction, "callerStageTransferFraction");
  nonnegative(
    input.callerAlreadyAccountedShrinkageStrain,
    "already accounted shrinkage",
  );
  return {
    stagePrestressStressLossPa:
      (input.callerMatchedShrinkageStrain -
        input.callerAlreadyAccountedShrinkageStrain) *
      input.prestressingSteelModulusPa *
      input.callerStageTransferFraction,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerMatchedShrinkageStrain: 0.001,
  callerAlreadyAccountedShrinkageStrain: 0,
  prestressingSteelModulusPa: 100000,
  callerStageTransferFraction: 0.5,
} satisfies Input;
export const exampleOutput = {
  stagePrestressStressLossPa: 50,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/prestress-loss-shrinkage",
  title: "Shrinkage Prestress Loss Calculator",
  description:
    "Account remaining independently established free shrinkage strain AFTER already accounted shrinkage, steel modulus and compatibility fraction; signed over-accounted shrinkage credit retained, distinct from elastic transfer measurement and creep coefficient. Caller establishes calibration and applicability; not design-code compliance or operating safety.",
  inputs: inputFields,
  outputs: [
    {
      id: "stagePrestressStressLossPa",
      label: "Stage prestress stress loss pa",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerMatchedShrinkageStrain:
        value.callerMatchedShrinkageStrain as number,
      callerAlreadyAccountedShrinkageStrain:
        value.callerAlreadyAccountedShrinkageStrain as number,
      prestressingSteelModulusPa: value.prestressingSteelModulusPa as number,
      callerStageTransferFraction: value.callerStageTransferFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
