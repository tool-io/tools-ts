import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch47-shared.js";
export type Input = Readonly<{
  readonly independentlyMeasuredWeightKg: number;
  readonly callerClinicianEstablishedApplicableMgPerKgCeiling: number;
  readonly callerClinicianEstablishedAbsoluteCeilingMg: number;
  readonly actualAlreadyAdministeredMg: number;
  readonly verifiedCartridgeDrugMgPerMl: number;
  readonly verifiedCartridgeVolumeMl: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyMeasuredWeightKg",
    label: "Independently measured weight kg",
    kind: "number",
  },
  {
    id: "callerClinicianEstablishedApplicableMgPerKgCeiling",
    label: "Caller clinician established applicable mg per kg ceiling",
    kind: "number",
  },
  {
    id: "callerClinicianEstablishedAbsoluteCeilingMg",
    label: "Caller clinician established absolute ceiling mg",
    kind: "number",
  },
  {
    id: "actualAlreadyAdministeredMg",
    label: "Actual already administered mg",
    kind: "number",
  },
  {
    id: "verifiedCartridgeDrugMgPerMl",
    label: "Verified cartridge drug mg per ml",
    kind: "number",
  },
  {
    id: "verifiedCartridgeVolumeMl",
    label: "Verified cartridge volume ml",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  [
    input.independentlyMeasuredWeightKg,
    input.callerClinicianEstablishedApplicableMgPerKgCeiling,
    input.callerClinicianEstablishedAbsoluteCeilingMg,
    input.verifiedCartridgeDrugMgPerMl,
    input.verifiedCartridgeVolumeMl,
  ].forEach((v) => positive(v, "qualified-input"));
  nonnegative(input.actualAlreadyAdministeredMg, "inventory");
  return {
    conditionalCallerRemainingCartridgeEquivalents:
      (Math.min(
        input.independentlyMeasuredWeightKg *
          input.callerClinicianEstablishedApplicableMgPerKgCeiling,
        input.callerClinicianEstablishedAbsoluteCeilingMg,
      ) -
        input.actualAlreadyAdministeredMg) /
      (input.verifiedCartridgeDrugMgPerMl * input.verifiedCartridgeVolumeMl),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyMeasuredWeightKg: 60,
    callerClinicianEstablishedApplicableMgPerKgCeiling: 1,
    callerClinicianEstablishedAbsoluteCeilingMg: 50,
    actualAlreadyAdministeredMg: 10,
    verifiedCartridgeDrugMgPerMl: 20,
    verifiedCartridgeVolumeMl: 2,
  },
  output: { result: { conditionalCallerRemainingCartridgeEquivalents: 1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "dentistry/anesthetic-carttridges-for-weight",
  title: "Cartridges For Weight Calculator",
  description:
    "Caller-established ceiling minus actual administered inventory divided by verified cartridge drug content. Signed fractional cartridge equivalents retained, no rounding upward, cartridge-count recommendation or safety approval; combined anesthetic/vasoconstrictor effects external.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observation, conditional calculation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
