import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly initialOxygenMgPerLiter: number;
  readonly lightBottleOxygenMgPerLiter: number;
  readonly darkBottleOxygenMgPerLiter: number;
  readonly incubationHours: number;
  readonly carbonOxygenMolarMassRatio: number;
  readonly photosyntheticQuotient: number;
}>;
export type Output = Readonly<{
  readonly netProductivityMgOxygenPerLiterDay: number;
  readonly respirationMgOxygenPerLiterDay: number;
  readonly grossProductivityMgOxygenPerLiterDay: number;
  readonly grossCarbonProductivityMgPerLiterDay: number;
}>;
const inputFields = [
  {
    id: "initialOxygenMgPerLiter",
    label: "Initial oxygen mg per liter",
    kind: "number",
  },
  {
    id: "lightBottleOxygenMgPerLiter",
    label: "Light bottle oxygen mg per liter",
    kind: "number",
  },
  {
    id: "darkBottleOxygenMgPerLiter",
    label: "Dark bottle oxygen mg per liter",
    kind: "number",
  },
  { id: "incubationHours", label: "Incubation hours", kind: "number" },
  {
    id: "carbonOxygenMolarMassRatio",
    label: "Carbon oxygen molar mass ratio",
    kind: "number",
  },
  {
    id: "photosyntheticQuotient",
    label: "Photosynthetic quotient",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.incubationHours, "incubationHours");
  positive(input.carbonOxygenMolarMassRatio, "carbonOxygenMolarMassRatio");
  positive(input.photosyntheticQuotient, "photosyntheticQuotient");
  nonnegative(input.initialOxygenMgPerLiter, "initialOxygenMgPerLiter");
  nonnegative(input.lightBottleOxygenMgPerLiter, "lightBottleOxygenMgPerLiter");
  nonnegative(input.darkBottleOxygenMgPerLiter, "darkBottleOxygenMgPerLiter");
  const k = 24 / input.incubationHours,
    netProductivityMgOxygenPerLiterDay =
      (input.lightBottleOxygenMgPerLiter - input.initialOxygenMgPerLiter) * k,
    respirationMgOxygenPerLiterDay =
      (input.initialOxygenMgPerLiter - input.darkBottleOxygenMgPerLiter) * k,
    grossProductivityMgOxygenPerLiterDay =
      netProductivityMgOxygenPerLiterDay + respirationMgOxygenPerLiterDay;
  return {
    netProductivityMgOxygenPerLiterDay,
    respirationMgOxygenPerLiterDay,
    grossProductivityMgOxygenPerLiterDay,
    grossCarbonProductivityMgPerLiterDay:
      (grossProductivityMgOxygenPerLiterDay *
        input.carbonOxygenMolarMassRatio) /
      input.photosyntheticQuotient,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  initialOxygenMgPerLiter: 10,
  lightBottleOxygenMgPerLiter: 12,
  darkBottleOxygenMgPerLiter: 9,
  incubationHours: 24,
  carbonOxygenMolarMassRatio: 0.375,
  photosyntheticQuotient: 1,
} satisfies Input;
export const exampleOutput = {
  netProductivityMgOxygenPerLiterDay: 2,
  respirationMgOxygenPerLiterDay: 1,
  grossProductivityMgOxygenPerLiterDay: 3,
  grossCarbonProductivityMgPerLiterDay: 1.125,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "limnology/light-dark-bottle-productivity",
  title: "Light Dark Bottle Productivity",
  description:
    "Balance initial/light/dark bottle oxygen to net, respiration and gross production with supplied carbon stoichiometry; incubation representativeness, gas leakage and bottle effects are not corrected.",
  inputs: inputFields,
  outputs: [
    {
      id: "netProductivityMgOxygenPerLiterDay",
      label: "Net productivity mg oxygen per liter day",
      kind: "number",
    },
    {
      id: "respirationMgOxygenPerLiterDay",
      label: "Respiration mg oxygen per liter day",
      kind: "number",
    },
    {
      id: "grossProductivityMgOxygenPerLiterDay",
      label: "Gross productivity mg oxygen per liter day",
      kind: "number",
    },
    {
      id: "grossCarbonProductivityMgPerLiterDay",
      label: "Gross carbon productivity mg per liter day",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      initialOxygenMgPerLiter: value.initialOxygenMgPerLiter as number,
      lightBottleOxygenMgPerLiter: value.lightBottleOxygenMgPerLiter as number,
      darkBottleOxygenMgPerLiter: value.darkBottleOxygenMgPerLiter as number,
      incubationHours: value.incubationHours as number,
      carbonOxygenMolarMassRatio: value.carbonOxygenMolarMassRatio as number,
      photosyntheticQuotient: value.photosyntheticQuotient as number,
    }),
});
export const run = tool.execute;
export default tool;
