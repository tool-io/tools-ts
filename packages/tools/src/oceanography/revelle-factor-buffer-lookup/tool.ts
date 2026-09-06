import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch38-shared.js";
export type Input = Readonly<{
  readonly observedReferencePco2Pa: number;
  readonly observedPerturbedPco2Pa: number;
  readonly observedReferenceDicMolM3: number;
  readonly observedPerturbedDicMolM3: number;
  readonly callerOtherCarbonateStateHeldFixedVerified: boolean;
}>;
export type Output = Readonly<{
  readonly finitePerturbationRevelleFactor: number;
}>;
const inputFields = [
  {
    id: "observedReferencePco2Pa",
    label: "Observed reference pco2 pa",
    kind: "number",
  },
  {
    id: "observedPerturbedPco2Pa",
    label: "Observed perturbed pco2 pa",
    kind: "number",
  },
  {
    id: "observedReferenceDicMolM3",
    label: "Observed reference dic mol m3",
    kind: "number",
  },
  {
    id: "observedPerturbedDicMolM3",
    label: "Observed perturbed dic mol m3",
    kind: "number",
  },
  {
    id: "callerOtherCarbonateStateHeldFixedVerified",
    label: "Caller other carbonate state held fixed verified",
    kind: "boolean",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.observedReferencePco2Pa, "observedReferencePco2Pa");
  positive(input.observedPerturbedPco2Pa, "observedPerturbedPco2Pa");
  positive(input.observedReferenceDicMolM3, "observedReferenceDicMolM3");
  positive(input.observedPerturbedDicMolM3, "observedPerturbedDicMolM3");
  if (
    !input.callerOtherCarbonateStateHeldFixedVerified ||
    input.observedPerturbedDicMolM3 === input.observedReferenceDicMolM3
  )
    simpleError(
      "experiment",
      "Matched temperature/salinity/alkalinity/pressure and nonzero independent DIC perturbation.",
    );
  return {
    finitePerturbationRevelleFactor:
      (input.observedPerturbedPco2Pa / input.observedReferencePco2Pa - 1) /
      (input.observedPerturbedDicMolM3 / input.observedReferenceDicMolM3 - 1),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedReferencePco2Pa: 40,
  observedPerturbedPco2Pa: 44,
  observedReferenceDicMolM3: 2,
  observedPerturbedDicMolM3: 2.1,
  callerOtherCarbonateStateHeldFixedVerified: true,
} satisfies Input;
export const exampleOutput = {
  finitePerturbationRevelleFactor: 2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "oceanography/revelle-factor-buffer-lookup",
  title: "Revelle Factor Buffer Lookup",
  description:
    "Observed normalized finite pCO2/DIC response at independently fixed state, not universal carbonate buffering lookup or alkalinity conversion. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "finitePerturbationRevelleFactor",
      label: "Finite perturbation revelle factor",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedReferencePco2Pa: value.observedReferencePco2Pa as number,
      observedPerturbedPco2Pa: value.observedPerturbedPco2Pa as number,
      observedReferenceDicMolM3: value.observedReferenceDicMolM3 as number,
      observedPerturbedDicMolM3: value.observedPerturbedDicMolM3 as number,
      callerOtherCarbonateStateHeldFixedVerified:
        value.callerOtherCarbonateStateHeldFixedVerified as boolean,
    }),
});
export const run = tool.execute;
export default tool;
