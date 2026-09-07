import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, linearFit } from "../batch36-shared.js";
export type Input = Readonly<{
  readonly observedUpperDiracBranchK: readonly number[];
  readonly observedUpperDiracBranchEnergyEv: readonly number[];
  readonly observedLowerDiracBranchK: readonly number[];
  readonly observedLowerDiracBranchEnergyEv: readonly number[];
}>;
export type Output = Readonly<{
  readonly fittedDiracPointK: number;
  readonly fittedDiracPointEnergyEv: number;
}>;
const inputFields = [
  {
    id: "observedUpperDiracBranchK",
    label: "Observed upper dirac branch k",
    kind: "numberList",
  },
  {
    id: "observedUpperDiracBranchEnergyEv",
    label: "Observed upper dirac branch energy ev",
    kind: "numberList",
  },
  {
    id: "observedLowerDiracBranchK",
    label: "Observed lower dirac branch k",
    kind: "numberList",
  },
  {
    id: "observedLowerDiracBranchEnergyEv",
    label: "Observed lower dirac branch energy ev",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const upper = linearFit(
      input.observedUpperDiracBranchK,
      input.observedUpperDiracBranchEnergyEv,
    ),
    lower = linearFit(
      input.observedLowerDiracBranchK,
      input.observedLowerDiracBranchEnergyEv,
    );
  if (upper.slope === lower.slope)
    simpleError(
      "branches",
      "Distinct independently selected linear crossing branches required.",
    );
  const k = (lower.intercept - upper.intercept) / (upper.slope - lower.slope);
  return {
    fittedDiracPointK: k,
    fittedDiracPointEnergyEv: upper.intercept + upper.slope * k,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedUpperDiracBranchK: [0, 1, 2],
  observedUpperDiracBranchEnergyEv: [1, 2, 3],
  observedLowerDiracBranchK: [0, 1, 2],
  observedLowerDiracBranchEnergyEv: [3, 2, 1],
} satisfies Input;
export const exampleOutput = {
  fittedDiracPointK: 1,
  fittedDiracPointEnergyEv: 2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/dirac-point-energy",
  title: "Semiconductor Dirac Point Energy Calculator",
  description:
    "Fit actual independently selected linear Dirac branches and report their intersection, not reference Fermi energy or a proof of protected Dirac crossing.",
  inputs: inputFields,
  outputs: [
    { id: "fittedDiracPointK", label: "Fitted dirac point k", kind: "number" },
    {
      id: "fittedDiracPointEnergyEv",
      label: "Fitted dirac point energy ev",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedUpperDiracBranchK:
        value.observedUpperDiracBranchK as readonly number[],
      observedUpperDiracBranchEnergyEv:
        value.observedUpperDiracBranchEnergyEv as readonly number[],
      observedLowerDiracBranchK:
        value.observedLowerDiracBranchK as readonly number[],
      observedLowerDiracBranchEnergyEv:
        value.observedLowerDiracBranchEnergyEv as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
