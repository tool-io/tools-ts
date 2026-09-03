import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
} from "../batch40-shared.js";
export type Input = Readonly<{
  readonly observedInitialWineMassG: number;
  readonly observedFinalReductionMassG: number;
  readonly independentlyAssayedInitialEthanolMassFraction: number;
  readonly independentlyAssayedFinalEthanolMassFraction: number;
}>;
export type Output = Readonly<{
  readonly totalReductionPercent: number;
  readonly assayedEthanolRemovedG: number;
}>;
const inputFields = [
  {
    id: "observedInitialWineMassG",
    label: "Observed initial wine mass g",
    kind: "number",
  },
  {
    id: "observedFinalReductionMassG",
    label: "Observed final reduction mass g",
    kind: "number",
  },
  {
    id: "independentlyAssayedInitialEthanolMassFraction",
    label: "Independently assayed initial ethanol mass fraction",
    kind: "number",
  },
  {
    id: "independentlyAssayedFinalEthanolMassFraction",
    label: "Independently assayed final ethanol mass fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.observedInitialWineMassG, "observedInitialWineMassG");
  nonnegative(input.observedFinalReductionMassG, "observedFinalReductionMassG");
  fraction(
    input.independentlyAssayedInitialEthanolMassFraction,
    "independentlyAssayedInitialEthanolMassFraction",
  );
  fraction(
    input.independentlyAssayedFinalEthanolMassFraction,
    "independentlyAssayedFinalEthanolMassFraction",
  );
  return {
    totalReductionPercent:
      (100 *
        (input.observedInitialWineMassG - input.observedFinalReductionMassG)) /
      input.observedInitialWineMassG,
    assayedEthanolRemovedG:
      input.observedInitialWineMassG *
        input.independentlyAssayedInitialEthanolMassFraction -
      input.observedFinalReductionMassG *
        input.independentlyAssayedFinalEthanolMassFraction,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedInitialWineMassG: 100,
  observedFinalReductionMassG: 50,
  independentlyAssayedInitialEthanolMassFraction: 0.1,
  independentlyAssayedFinalEthanolMassFraction: 0.04,
} satisfies Input;
export const exampleOutput = {
  totalReductionPercent: 50,
  assayedEthanolRemovedG: 8,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cooking/wine-reduction-ratio",
  title: "Cooking Wine Reduction Ratio Calculator",
  description:
    "Wine reduction mass contrast AND independently assayed ethanol balance, unlike sauce volatile loss; alcohol removal never inferred from cooking time alone. Caller establishes matching ingredient basis and method. Not food-safety, doneness, preservation or allergy certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "totalReductionPercent",
      label: "Total reduction percent",
      kind: "number",
    },
    {
      id: "assayedEthanolRemovedG",
      label: "Assayed ethanol removed g",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedInitialWineMassG: value.observedInitialWineMassG as number,
      observedFinalReductionMassG: value.observedFinalReductionMassG as number,
      independentlyAssayedInitialEthanolMassFraction:
        value.independentlyAssayedInitialEthanolMassFraction as number,
      independentlyAssayedFinalEthanolMassFraction:
        value.independentlyAssayedFinalEthanolMassFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
