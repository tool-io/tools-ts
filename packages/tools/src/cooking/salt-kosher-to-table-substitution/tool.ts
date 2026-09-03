import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch40-shared.js";
export type Input = Readonly<{
  readonly observedKosherSaltVolumeMl: number;
  readonly independentKosherBulkDensityGMl: number;
  readonly independentTableBulkDensityGMl: number;
}>;
export type Output = Readonly<{
  readonly equivalentTableSaltVolumeMl: number;
  readonly saltMassG: number;
}>;
const inputFields = [
  {
    id: "observedKosherSaltVolumeMl",
    label: "Observed kosher salt volume ml",
    kind: "number",
  },
  {
    id: "independentKosherBulkDensityGMl",
    label: "Independent kosher bulk density g ml",
    kind: "number",
  },
  {
    id: "independentTableBulkDensityGMl",
    label: "Independent table bulk density g ml",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.independentKosherBulkDensityGMl,
    "independentKosherBulkDensityGMl",
  );
  positive(
    input.independentTableBulkDensityGMl,
    "independentTableBulkDensityGMl",
  );
  nonnegative(input.observedKosherSaltVolumeMl, "observedKosherSaltVolumeMl");
  const m =
    input.observedKosherSaltVolumeMl * input.independentKosherBulkDensityGMl;
  return {
    equivalentTableSaltVolumeMl: m / input.independentTableBulkDensityGMl,
    saltMassG: m,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedKosherSaltVolumeMl: 10,
  independentKosherBulkDensityGMl: 0.8,
  independentTableBulkDensityGMl: 1.2,
} satisfies Input;
export const exampleOutput = {
  equivalentTableSaltVolumeMl: 6.666666666666667,
  saltMassG: 8,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cooking/salt-kosher-to-table-substitution",
  title: "Cooking Salt Kosher To Table Substitution Calculator",
  description:
    "Salt substitution by independently measured brand/packing bulk densities, equivalent salt mass; kosher/table particle geometry not universal. Caller establishes matching ingredient basis and method. Not food-safety, doneness, preservation or allergy certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "equivalentTableSaltVolumeMl",
      label: "Equivalent table salt volume ml",
      kind: "number",
    },
    { id: "saltMassG", label: "Salt mass g", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      observedKosherSaltVolumeMl: value.observedKosherSaltVolumeMl as number,
      independentKosherBulkDensityGMl:
        value.independentKosherBulkDensityGMl as number,
      independentTableBulkDensityGMl:
        value.independentTableBulkDensityGMl as number,
    }),
});
export const run = tool.execute;
export default tool;
