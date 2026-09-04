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
  readonly callerMatchedSustainedElasticStrain: number;
  readonly callerIndependentCreepCoefficient: number;
  readonly prestressingSteelModulusPa: number;
  readonly callerStageTransferFraction: number;
}>;
export type Output = Readonly<{ readonly stagePrestressStressLossPa: number }>;
const inputFields = [
  {
    id: "callerMatchedSustainedElasticStrain",
    label: "Caller matched sustained elastic strain",
    kind: "number",
  },
  {
    id: "callerIndependentCreepCoefficient",
    label: "Caller independent creep coefficient",
    kind: "number",
  },
  {
    id: "prestressingSteelModulusPa",
    label: "Prestressing steel modulus pa",
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
    input.callerMatchedSustainedElasticStrain,
    "sustained elastic strain",
  );
  nonnegative(input.callerIndependentCreepCoefficient, "creep coefficient");
  fraction(input.callerStageTransferFraction, "callerStageTransferFraction");
  return {
    stagePrestressStressLossPa:
      input.callerMatchedSustainedElasticStrain *
      input.callerIndependentCreepCoefficient *
      input.prestressingSteelModulusPa *
      input.callerStageTransferFraction,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerMatchedSustainedElasticStrain: 0.001,
  callerIndependentCreepCoefficient: 1,
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
  id: "engineering/prestress-loss-creep",
  title: "Creep Prestress Loss Calculator",
  description:
    "Compute creep prestress loss from independently established sustained-load elastic concrete strain times age/humidity-matched creep coefficient, steel modulus and transfer fraction; not transfer-stage shortening or measured free shrinkage. Caller establishes calibration and applicability; not design-code compliance, safety or a validated forecast.",
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
      callerMatchedSustainedElasticStrain:
        value.callerMatchedSustainedElasticStrain as number,
      callerIndependentCreepCoefficient:
        value.callerIndependentCreepCoefficient as number,
      prestressingSteelModulusPa: value.prestressingSteelModulusPa as number,
      callerStageTransferFraction: value.callerStageTransferFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
