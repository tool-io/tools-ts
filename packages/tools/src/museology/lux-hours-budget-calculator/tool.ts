import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative, aligned } from "../shared.js";
export type Input = Readonly<{
  readonly observedLux: readonly number[];
  readonly representedHours: readonly number[];
  readonly priorAnnualLuxHours: number;
  readonly callerAnnualLuxHourBudget: number;
}>;
export type Output = Readonly<{
  readonly addedLuxHours: number;
  readonly annualLuxHours: number;
  readonly signedRemainingLuxHours: number;
}>;
const inputFields = [
  { id: "observedLux", label: "Observed lux", kind: "numberList" },
  { id: "representedHours", label: "Represented hours", kind: "numberList" },
  {
    id: "priorAnnualLuxHours",
    label: "Prior annual lux hours",
    kind: "number",
  },
  {
    id: "callerAnnualLuxHourBudget",
    label: "Caller annual lux hour budget",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedLux.forEach((v) => nonnegative(v, "observedLux"));
  input.representedHours.forEach((v) => nonnegative(v, "representedHours"));
  nonnegative(input.priorAnnualLuxHours, "priorAnnualLuxHours");
  nonnegative(input.callerAnnualLuxHourBudget, "callerAnnualLuxHourBudget");
  aligned(input.observedLux, input.representedHours, "observedLux");
  const addedLuxHours = input.observedLux.reduce(
      (s, v, i) => s + v * input.representedHours[i],
      0,
    ),
    annualLuxHours = input.priorAnnualLuxHours + addedLuxHours;
  return {
    addedLuxHours,
    annualLuxHours,
    signedRemainingLuxHours: input.callerAnnualLuxHourBudget - annualLuxHours,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedLux: [50, 100],
  representedHours: [100, 200],
  priorAnnualLuxHours: 1000,
  callerAnnualLuxHourBudget: 20000,
} satisfies Input;
export const exampleOutput = {
  addedLuxHours: 25000,
  annualLuxHours: 26000,
  signedRemainingLuxHours: -6000,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "museology/lux-hours-budget-calculator",
  title: "Light-Sensitive Object Annual Lux-Hours Budget Calculator",
  description:
    "Account measured object light exposure and prior annual ledger against caller budget, retaining signed overspend; dose is not a material-safe limit.",
  inputs: inputFields,
  outputs: [
    { id: "addedLuxHours", label: "Added lux hours", kind: "number" },
    { id: "annualLuxHours", label: "Annual lux hours", kind: "number" },
    {
      id: "signedRemainingLuxHours",
      label: "Signed remaining lux hours",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedLux: value.observedLux as readonly number[],
      representedHours: value.representedHours as readonly number[],
      priorAnnualLuxHours: value.priorAnnualLuxHours as number,
      callerAnnualLuxHourBudget: value.callerAnnualLuxHourBudget as number,
    }),
});
export const run = tool.execute;
export default tool;
