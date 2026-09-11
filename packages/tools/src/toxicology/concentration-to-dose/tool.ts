import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualSubstanceConcentrationMgPerMl: number;
  readonly actualRecordedContactOrIntakeVolumeMl: number;
  readonly actualIndependentlyMeasuredBodyMassKg: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualSubstanceConcentrationMgPerMl",
    label: "Actual substance concentration mg per ml",
    kind: "number",
  },
  {
    id: "actualRecordedContactOrIntakeVolumeMl",
    label: "Actual recorded contact or intake volume ml",
    kind: "number",
  },
  {
    id: "actualIndependentlyMeasuredBodyMassKg",
    label: "Actual independently measured body mass kg",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(input.actualSubstanceConcentrationMgPerMl, "concentration");
  nonnegative(input.actualRecordedContactOrIntakeVolumeMl, "actual-volume");
  positive(input.actualIndependentlyMeasuredBodyMassKg, "mass");
  return {
    conditionalAdministeredDoseMgPerKg:
      (input.actualSubstanceConcentrationMgPerMl *
        input.actualRecordedContactOrIntakeVolumeMl) /
      input.actualIndependentlyMeasuredBodyMassKg,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualSubstanceConcentrationMgPerMl: 2,
    actualRecordedContactOrIntakeVolumeMl: 3,
    actualIndependentlyMeasuredBodyMassKg: 2,
  },
  output: { result: { conditionalAdministeredDoseMgPerKg: 3 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "toxicology/concentration-to-dose",
  title: "Concentration to Dose Calculator",
  description:
    "Actual mg/mL\u00d7actual recorded mL/kgadministered-dose accounting, not absorbed dose, exposure-time kinetics or recommended dose. Same substance and actual applicable intake/contact route external.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observed calculation or explicit reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
