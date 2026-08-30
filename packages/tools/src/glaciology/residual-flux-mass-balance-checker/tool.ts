import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly accumulationKgPerYear: number;
  readonly ablationKgPerYear: number;
  readonly inwardGateFluxKgPerYear: number;
  readonly outwardGateFluxKgPerYear: number;
  readonly observedStorageChangeKgPerYear: number;
  readonly closureToleranceKgPerYear: number;
}>;
export type Output = Readonly<{
  readonly predictedStorageChangeKgPerYear: number;
  readonly budgetResidualKgPerYear: number;
  readonly withinClosureTolerance: boolean;
}>;
const inputFields = [
  {
    id: "accumulationKgPerYear",
    label: "Accumulation kg per year",
    kind: "number",
  },
  { id: "ablationKgPerYear", label: "Ablation kg per year", kind: "number" },
  {
    id: "inwardGateFluxKgPerYear",
    label: "Inward gate flux kg per year",
    kind: "number",
  },
  {
    id: "outwardGateFluxKgPerYear",
    label: "Outward gate flux kg per year",
    kind: "number",
  },
  {
    id: "observedStorageChangeKgPerYear",
    label: "Observed storage change kg per year",
    kind: "number",
  },
  {
    id: "closureToleranceKgPerYear",
    label: "Closure tolerance kg per year",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(input.accumulationKgPerYear, "accumulationKgPerYear");
  nonnegative(input.ablationKgPerYear, "ablationKgPerYear");
  nonnegative(input.inwardGateFluxKgPerYear, "inwardGateFluxKgPerYear");
  nonnegative(input.outwardGateFluxKgPerYear, "outwardGateFluxKgPerYear");
  nonnegative(input.closureToleranceKgPerYear, "closureToleranceKgPerYear");
  const predictedStorageChangeKgPerYear =
      input.accumulationKgPerYear -
      input.ablationKgPerYear +
      input.inwardGateFluxKgPerYear -
      input.outwardGateFluxKgPerYear,
    budgetResidualKgPerYear =
      input.observedStorageChangeKgPerYear - predictedStorageChangeKgPerYear;
  return {
    predictedStorageChangeKgPerYear,
    budgetResidualKgPerYear,
    withinClosureTolerance:
      Math.abs(budgetResidualKgPerYear) <= input.closureToleranceKgPerYear,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  accumulationKgPerYear: 100,
  ablationKgPerYear: 80,
  inwardGateFluxKgPerYear: 10,
  outwardGateFluxKgPerYear: 40,
  observedStorageChangeKgPerYear: -5,
  closureToleranceKgPerYear: 1,
} satisfies Input;
export const exampleOutput = {
  predictedStorageChangeKgPerYear: -10,
  budgetResidualKgPerYear: 5,
  withinClosureTolerance: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "glaciology/residual-flux-mass-balance-checker",
  title: "Residual Flux Mass Balance Checker",
  description:
    "Audit a bounded glacier mass-control-volume budget against independent observed storage change; residual sign is observed minus predicted and missing processes are not diagnosed.",
  inputs: inputFields,
  outputs: [
    {
      id: "predictedStorageChangeKgPerYear",
      label: "Predicted storage change kg per year",
      kind: "number",
    },
    {
      id: "budgetResidualKgPerYear",
      label: "Budget residual kg per year",
      kind: "number",
    },
    {
      id: "withinClosureTolerance",
      label: "Within closure tolerance",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      accumulationKgPerYear: value.accumulationKgPerYear as number,
      ablationKgPerYear: value.ablationKgPerYear as number,
      inwardGateFluxKgPerYear: value.inwardGateFluxKgPerYear as number,
      outwardGateFluxKgPerYear: value.outwardGateFluxKgPerYear as number,
      observedStorageChangeKgPerYear:
        value.observedStorageChangeKgPerYear as number,
      closureToleranceKgPerYear: value.closureToleranceKgPerYear as number,
    }),
});
export const run = tool.execute;
export default tool;
