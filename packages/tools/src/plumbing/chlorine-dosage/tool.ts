import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly callerQualifiedTreatmentTargetActiveChlorineMgPerLiter: number;
  readonly actualWaterVolumeLiters: number;
  readonly callerVerifiedProductActiveChlorineMassFraction: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerQualifiedTreatmentTargetActiveChlorineMgPerLiter",
    label: "Caller qualified treatment target active chlorine mg per liter",
    kind: "number",
  },
  {
    id: "actualWaterVolumeLiters",
    label: "Actual water volume liters",
    kind: "number",
  },
  {
    id: "callerVerifiedProductActiveChlorineMassFraction",
    label: "Caller verified product active chlorine mass fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(
    input.callerQualifiedTreatmentTargetActiveChlorineMgPerLiter,
    "callerQualifiedTreatmentTargetActiveChlorineMgPerLiter",
  );
  nonnegative(input.actualWaterVolumeLiters, "actualWaterVolumeLiters");
  positive(
    input.callerVerifiedProductActiveChlorineMassFraction,
    "callerVerifiedProductActiveChlorineMassFraction",
  );
  return {
    value:
      (input.callerQualifiedTreatmentTargetActiveChlorineMgPerLiter *
        input.actualWaterVolumeLiters) /
      input.callerVerifiedProductActiveChlorineMassFraction,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerQualifiedTreatmentTargetActiveChlorineMgPerLiter: 2,
    actualWaterVolumeLiters: 50,
    callerVerifiedProductActiveChlorineMassFraction: 0.5,
  },
  output: { result: { value: 200 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/chlorine-dosage",
  title: "Plumbing Chlorine Dosage Calculator",
  description:
    "Ledger targetactivechlorinemg/L\u00d7actual water volume/product active-mass fraction, all independently treatment professional-established. No dis infection target selected, mixing recipe, pot ability, safe exposure or efficacy. Actual independently matched units, regime, material/equipment and governing references; not a hydraulic code, safe pressure, water pot ability or operational approval.",
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
