import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../shared.js";
export type Input = Readonly<{
  readonly iceMassKg: number;
  readonly annualAccumulationKg: number;
  readonly annualAblationAndDischargeKg: number;
}>;
export type Output = Readonly<{
  readonly accumulationTurnoverYears: number;
  readonly lossTurnoverYears: number;
  readonly netMassChangeKgPerYear: number;
}>;
const inputFields = [
  { id: "iceMassKg", label: "Ice mass kg", kind: "number" },
  {
    id: "annualAccumulationKg",
    label: "Annual accumulation kg",
    kind: "number",
  },
  {
    id: "annualAblationAndDischargeKg",
    label: "Annual ablation and discharge kg",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.iceMassKg, "iceMassKg");
  positive(input.annualAccumulationKg, "annualAccumulationKg");
  positive(input.annualAblationAndDischargeKg, "annualAblationAndDischargeKg");
  return {
    accumulationTurnoverYears: input.iceMassKg / input.annualAccumulationKg,
    lossTurnoverYears: input.iceMassKg / input.annualAblationAndDischargeKg,
    netMassChangeKgPerYear:
      input.annualAccumulationKg - input.annualAblationAndDischargeKg,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  iceMassKg: 1000,
  annualAccumulationKg: 100,
  annualAblationAndDischargeKg: 125,
} satisfies Input;
export const exampleOutput = {
  accumulationTurnoverYears: 10,
  lossTurnoverYears: 8,
  netMassChangeKgPerYear: -25,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "glaciology/mass-turnover-time",
  title: "Mass Turnover Time",
  description:
    "Distinguish inventory/accumulation and inventory/loss turnover under supplied mass fluxes; neither is the dynamical terminus response time.",
  inputs: inputFields,
  outputs: [
    {
      id: "accumulationTurnoverYears",
      label: "Accumulation turnover years",
      kind: "number",
    },
    { id: "lossTurnoverYears", label: "Loss turnover years", kind: "number" },
    {
      id: "netMassChangeKgPerYear",
      label: "Net mass change kg per year",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      iceMassKg: value.iceMassKg as number,
      annualAccumulationKg: value.annualAccumulationKg as number,
      annualAblationAndDischargeKg:
        value.annualAblationAndDischargeKg as number,
    }),
});
export const run = tool.execute;
export default tool;
