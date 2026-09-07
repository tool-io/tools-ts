import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  fraction,
  aligned,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly observedImplantDosesPerM2: readonly number[];
  readonly callerActivatedDoseFractions: readonly number[];
  readonly callerMatchedMobilitiesM2VoltSecond: readonly number[];
  readonly callerElementaryChargeC: number;
}>;
export type Output = Readonly<{
  readonly modeledImplantSheetOhms: readonly number[];
}>;
const inputFields = [
  {
    id: "observedImplantDosesPerM2",
    label: "Observed implant doses per m2",
    kind: "numberList",
  },
  {
    id: "callerActivatedDoseFractions",
    label: "Caller activated dose fractions",
    kind: "numberList",
  },
  {
    id: "callerMatchedMobilitiesM2VoltSecond",
    label: "Caller matched mobilities m2 volt second",
    kind: "numberList",
  },
  {
    id: "callerElementaryChargeC",
    label: "Caller elementary charge c",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedImplantDosesPerM2.forEach((v) =>
    positive(v, "observedImplantDosesPerM2"),
  );
  input.callerActivatedDoseFractions.forEach((v) =>
    positive(v, "callerActivatedDoseFractions"),
  );
  input.callerMatchedMobilitiesM2VoltSecond.forEach((v) =>
    positive(v, "callerMatchedMobilitiesM2VoltSecond"),
  );
  positive(input.callerElementaryChargeC, "callerElementaryChargeC");
  input.callerActivatedDoseFractions.forEach((v) =>
    fraction(v, "callerActivatedDoseFractions"),
  );
  aligned(
    input.observedImplantDosesPerM2,
    input.callerActivatedDoseFractions,
    "observedImplantDosesPerM2",
  );
  aligned(
    input.observedImplantDosesPerM2,
    input.callerMatchedMobilitiesM2VoltSecond,
    "observedImplantDosesPerM2",
  );
  return {
    modeledImplantSheetOhms: input.observedImplantDosesPerM2.map(
      (v, i) =>
        1 /
        (input.callerElementaryChargeC *
          v *
          input.callerActivatedDoseFractions[i] *
          input.callerMatchedMobilitiesM2VoltSecond[i]),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedImplantDosesPerM2: [1e16, 2e16],
  callerActivatedDoseFractions: [0.5, 0.5],
  callerMatchedMobilitiesM2VoltSecond: [0.1, 0.2],
  callerElementaryChargeC: 1.6e-19,
} satisfies Input;
export const exampleOutput = {
  modeledImplantSheetOhms: [12500, 3125],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/sheet-resistance-implant-dose",
  title: "Semiconductor Sheet Resistance Implant Dose Calculator",
  description:
    "Budget implant integrated sheet dose with independently established activation and mobility, not existing uniform volume-doped film thickness formula or implant recipe.",
  inputs: inputFields,
  outputs: [
    {
      id: "modeledImplantSheetOhms",
      label: "Modeled implant sheet ohms",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedImplantDosesPerM2:
        value.observedImplantDosesPerM2 as readonly number[],
      callerActivatedDoseFractions:
        value.callerActivatedDoseFractions as readonly number[],
      callerMatchedMobilitiesM2VoltSecond:
        value.callerMatchedMobilitiesM2VoltSecond as readonly number[],
      callerElementaryChargeC: value.callerElementaryChargeC as number,
    }),
});
export const run = tool.execute;
export default tool;
