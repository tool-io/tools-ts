import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualDryBiomassMassKg: number;
  readonly callerMatchedNetCalorificValueJoulesPerKg: number;
  readonly callerActualConversionEfficiency: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualDryBiomassMassKg",
    label: "Actual dry biomass mass kg",
    kind: "number",
  },
  {
    id: "callerMatchedNetCalorificValueJoulesPerKg",
    label: "Caller matched net calorific value joules per kg",
    kind: "number",
  },
  {
    id: "callerActualConversionEfficiency",
    label: "Caller actual conversion efficiency",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(input.actualDryBiomassMassKg, "actualDryBiomassMassKg");
  positive(
    input.callerMatchedNetCalorificValueJoulesPerKg,
    "callerMatchedNetCalorificValueJoulesPerKg",
  );
  fraction(
    input.callerActualConversionEfficiency,
    "callerActualConversionEfficiency",
  );
  return {
    value:
      input.actualDryBiomassMassKg *
      input.callerMatchedNetCalorificValueJoulesPerKg *
      input.callerActualConversionEfficiency,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualDryBiomassMassKg: 2,
    callerMatchedNetCalorificValueJoulesPerKg: 20,
    callerActualConversionEfficiency: 0.5,
  },
  output: { result: { value: 20 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/biomass-energy-yield",
  title: "Biomass Energy Yield Calculator",
  description:
    "Actual dry biomass mass\u00d7independently matched netcalorificvalue\u00d7conversion efficiency useful energy; moisture basis/auxiliary costs external. Actual independently established compatible SI units/model context; conditional arithmetic, not code compliance, engineering design or safe operation approval.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
