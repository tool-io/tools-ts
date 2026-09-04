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
  readonly observedConcreteShorteningM: number;
  readonly matchedConcreteGaugeLengthM: number;
  readonly prestressingSteelModulusPa: number;
  readonly callerStageTransferFraction: number;
}>;
export type Output = Readonly<{ readonly stagePrestressStressLossPa: number }>;
const inputFields = [
  {
    id: "observedConcreteShorteningM",
    label: "Observed concrete shortening m",
    kind: "number",
  },
  {
    id: "matchedConcreteGaugeLengthM",
    label: "Matched concrete gauge length m",
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
  nonnegative(input.observedConcreteShorteningM, "observedConcreteShorteningM");
  positive(input.matchedConcreteGaugeLengthM, "gauge length");
  fraction(input.callerStageTransferFraction, "callerStageTransferFraction");
  return {
    stagePrestressStressLossPa:
      (input.observedConcreteShorteningM / input.matchedConcreteGaugeLengthM) *
      input.prestressingSteelModulusPa *
      input.callerStageTransferFraction,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedConcreteShorteningM: 0.001,
  matchedConcreteGaugeLengthM: 1,
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
  id: "engineering/prestress-loss-elastic",
  title: "Elastic Prestress Loss Calculator",
  description:
    "Infer actual transfer-stage shortening strain from independently measured shortening and matched gauge length, then elastic steel compatibility and caller transfer fraction; distinct from sustained creep coefficient and shrinkage increment records. Caller independently establishes units, regime and applicability; not design-code compliance or operating safety.",
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
      observedConcreteShorteningM: value.observedConcreteShorteningM as number,
      matchedConcreteGaugeLengthM: value.matchedConcreteGaugeLengthM as number,
      prestressingSteelModulusPa: value.prestressingSteelModulusPa as number,
      callerStageTransferFraction: value.callerStageTransferFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
