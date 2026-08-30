import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly respiratoryOxygenKgPerDay: number;
  readonly respiratoryQuotient: number;
  readonly co2OxygenMolarMassRatio: number;
  readonly otherCo2KgPerDay: number;
}>;
export type Output = Readonly<{
  readonly respiratoryCo2KgPerDay: number;
  readonly totalCo2KgPerDay: number;
}>;
const inputFields = [
  {
    id: "respiratoryOxygenKgPerDay",
    label: "Respiratory oxygen kg per day",
    kind: "number",
  },
  { id: "respiratoryQuotient", label: "Respiratory quotient", kind: "number" },
  {
    id: "co2OxygenMolarMassRatio",
    label: "Co2 oxygen molar mass ratio",
    kind: "number",
  },
  { id: "otherCo2KgPerDay", label: "Other co2 kg per day", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.co2OxygenMolarMassRatio, "co2OxygenMolarMassRatio");
  nonnegative(input.respiratoryOxygenKgPerDay, "respiratoryOxygenKgPerDay");
  nonnegative(input.respiratoryQuotient, "respiratoryQuotient");
  nonnegative(input.otherCo2KgPerDay, "otherCo2KgPerDay");
  const respiratoryCo2KgPerDay =
    input.respiratoryOxygenKgPerDay *
    input.respiratoryQuotient *
    input.co2OxygenMolarMassRatio;
  return {
    respiratoryCo2KgPerDay,
    totalCo2KgPerDay: respiratoryCo2KgPerDay + input.otherCo2KgPerDay,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  respiratoryOxygenKgPerDay: 10,
  respiratoryQuotient: 0.8,
  co2OxygenMolarMassRatio: 1.375,
  otherCo2KgPerDay: 2,
} satisfies Input;
export const exampleOutput = {
  respiratoryCo2KgPerDay: 11,
  totalCo2KgPerDay: 13,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "aquaculture/co2-production",
  title: "Carbon Dioxide Production",
  description:
    "Convert measured respiratory oxygen uptake to CO2 production using caller molar respiratory quotient and mass ratio, adding separate nonrespiratory CO2; not a dissolved-CO2 equilibrium calculation.",
  inputs: inputFields,
  outputs: [
    {
      id: "respiratoryCo2KgPerDay",
      label: "Respiratory co2 kg per day",
      kind: "number",
    },
    { id: "totalCo2KgPerDay", label: "Total co2 kg per day", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      respiratoryOxygenKgPerDay: value.respiratoryOxygenKgPerDay as number,
      respiratoryQuotient: value.respiratoryQuotient as number,
      co2OxygenMolarMassRatio: value.co2OxygenMolarMassRatio as number,
      otherCo2KgPerDay: value.otherCo2KgPerDay as number,
    }),
});
export const run = tool.execute;
export default tool;
