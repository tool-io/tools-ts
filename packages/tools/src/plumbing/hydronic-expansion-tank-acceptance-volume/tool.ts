import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly observedColdHydronicSystemLiters: number;
  readonly callerMatchedColdDensityKgLiter: number;
  readonly callerMatchedHotDensityKgLiter: number;
  readonly observedTankNominalLiters: number;
  readonly callerVerifiedUsableAcceptanceFraction: number;
}>;
export type Output = Readonly<{
  readonly modeledHydronicThermalExpansionLiters: number;
  readonly observedTankUsableAcceptanceLiters: number;
  readonly signedHydronicAcceptanceMarginLiters: number;
}>;
const inputFields = [
  {
    id: "observedColdHydronicSystemLiters",
    label: "Observed cold hydronic system liters",
    kind: "number",
  },
  {
    id: "callerMatchedColdDensityKgLiter",
    label: "Caller matched cold density kg liter",
    kind: "number",
  },
  {
    id: "callerMatchedHotDensityKgLiter",
    label: "Caller matched hot density kg liter",
    kind: "number",
  },
  {
    id: "observedTankNominalLiters",
    label: "Observed tank nominal liters",
    kind: "number",
  },
  {
    id: "callerVerifiedUsableAcceptanceFraction",
    label: "Caller verified usable acceptance fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.callerMatchedColdDensityKgLiter,
    "callerMatchedColdDensityKgLiter",
  );
  positive(
    input.callerMatchedHotDensityKgLiter,
    "callerMatchedHotDensityKgLiter",
  );
  nonnegative(
    input.observedColdHydronicSystemLiters,
    "observedColdHydronicSystemLiters",
  );
  nonnegative(input.observedTankNominalLiters, "observedTankNominalLiters");
  fraction(
    input.callerVerifiedUsableAcceptanceFraction,
    "callerVerifiedUsableAcceptanceFraction",
  );
  if (
    input.callerMatchedHotDensityKgLiter > input.callerMatchedColdDensityKgLiter
  )
    simpleError(
      "density",
      "Caller hot expansion branch requires hot density no larger than cold.",
    );
  const expansion =
      input.observedColdHydronicSystemLiters *
      (input.callerMatchedColdDensityKgLiter /
        input.callerMatchedHotDensityKgLiter -
        1),
    accept =
      input.observedTankNominalLiters *
      input.callerVerifiedUsableAcceptanceFraction;
  return {
    modeledHydronicThermalExpansionLiters: expansion,
    observedTankUsableAcceptanceLiters: accept,
    signedHydronicAcceptanceMarginLiters: accept - expansion,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedColdHydronicSystemLiters: 100,
  callerMatchedColdDensityKgLiter: 1,
  callerMatchedHotDensityKgLiter: 0.98,
  observedTankNominalLiters: 10,
  callerVerifiedUsableAcceptanceFraction: 0.3,
} satisfies Input;
export const exampleOutput = {
  modeledHydronicThermalExpansionLiters: 2.0408163265306123,
  observedTankUsableAcceptanceLiters: 3,
  signedHydronicAcceptanceMarginLiters: 0.9591836734693877,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/hydronic-expansion-tank-acceptance-volume",
  title: "Plumbing Hydronic Expansion Tank Acceptance Volume Calculator",
  description:
    "Audit actual hydronic fluid density-derived expanded volume against independently verified installed tank acceptance; distinct from ideal inverse gas-volume sizing, no bladder compatibility or pressure safety.",
  inputs: inputFields,
  outputs: [
    {
      id: "modeledHydronicThermalExpansionLiters",
      label: "Modeled hydronic thermal expansion liters",
      kind: "number",
    },
    {
      id: "observedTankUsableAcceptanceLiters",
      label: "Observed tank usable acceptance liters",
      kind: "number",
    },
    {
      id: "signedHydronicAcceptanceMarginLiters",
      label: "Signed hydronic acceptance margin liters",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedColdHydronicSystemLiters:
        value.observedColdHydronicSystemLiters as number,
      callerMatchedColdDensityKgLiter:
        value.callerMatchedColdDensityKgLiter as number,
      callerMatchedHotDensityKgLiter:
        value.callerMatchedHotDensityKgLiter as number,
      observedTankNominalLiters: value.observedTankNominalLiters as number,
      callerVerifiedUsableAcceptanceFraction:
        value.callerVerifiedUsableAcceptanceFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
