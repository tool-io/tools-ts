import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly callerCarbonaceousOxygenKgDay: number;
  readonly callerNitrificationOxygenKgDay: number;
  readonly callerIndependentDenitrificationCreditKgDay: number;
  readonly callerActualTransferFraction: number;
}>;
export type Output = Readonly<{
  readonly modeledGrossAerationOxygenKgDay: number;
}>;
const inputFields = [
  {
    id: "callerCarbonaceousOxygenKgDay",
    label: "Caller carbonaceous oxygen kg day",
    kind: "number",
  },
  {
    id: "callerNitrificationOxygenKgDay",
    label: "Caller nitrification oxygen kg day",
    kind: "number",
  },
  {
    id: "callerIndependentDenitrificationCreditKgDay",
    label: "Caller independent denitrification credit kg day",
    kind: "number",
  },
  {
    id: "callerActualTransferFraction",
    label: "Caller actual transfer fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.callerActualTransferFraction, "callerActualTransferFraction");
  nonnegative(
    input.callerCarbonaceousOxygenKgDay,
    "callerCarbonaceousOxygenKgDay",
  );
  nonnegative(
    input.callerNitrificationOxygenKgDay,
    "callerNitrificationOxygenKgDay",
  );
  nonnegative(
    input.callerIndependentDenitrificationCreditKgDay,
    "callerIndependentDenitrificationCreditKgDay",
  );
  fraction(input.callerActualTransferFraction, "callerActualTransferFraction");
  return {
    modeledGrossAerationOxygenKgDay:
      (input.callerCarbonaceousOxygenKgDay +
        input.callerNitrificationOxygenKgDay -
        input.callerIndependentDenitrificationCreditKgDay) /
      input.callerActualTransferFraction,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerCarbonaceousOxygenKgDay: 10,
  callerNitrificationOxygenKgDay: 5,
  callerIndependentDenitrificationCreditKgDay: 2,
  callerActualTransferFraction: 0.5,
} satisfies Input;
export const exampleOutput = {
  modeledGrossAerationOxygenKgDay: 26,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/aeration-oxygen-requirement",
  title: "Aeration Oxygen Requirement Calculator",
  description:
    "Separate independent carbonaceous/nitrification demands and denitrification oxygen-equivalent credit, actual transfer explicit; signed net accounting not installed aeration safety. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "modeledGrossAerationOxygenKgDay",
      label: "Modeled gross aeration oxygen kg day",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerCarbonaceousOxygenKgDay:
        value.callerCarbonaceousOxygenKgDay as number,
      callerNitrificationOxygenKgDay:
        value.callerNitrificationOxygenKgDay as number,
      callerIndependentDenitrificationCreditKgDay:
        value.callerIndependentDenitrificationCreditKgDay as number,
      callerActualTransferFraction:
        value.callerActualTransferFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
