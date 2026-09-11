import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch47-shared.js";
export type Input = Readonly<{
  readonly independentlyMeasuredRecipientMassKg: number;
  readonly callerVeterinarianPrescribedTransfusionMlPerKg: number;
  readonly actualRecordedTransfusedMl: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyMeasuredRecipientMassKg",
    label: "Independently measured recipient mass kg",
    kind: "number",
  },
  {
    id: "callerVeterinarianPrescribedTransfusionMlPerKg",
    label: "Caller veterinarian prescribed transfusion ml per kg",
    kind: "number",
  },
  {
    id: "actualRecordedTransfusedMl",
    label: "Actual recorded transfused ml",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.independentlyMeasuredRecipientMassKg, "mass");
  positive(
    input.callerVeterinarianPrescribedTransfusionMlPerKg,
    "independent-prescription",
  );
  nonnegative(input.actualRecordedTransfusedMl, "actual");
  const v =
    input.independentlyMeasuredRecipientMassKg *
    input.callerVeterinarianPrescribedTransfusionMlPerKg;
  return {
    conditionalPrescribedTransfusionMl: v,
    signedActualMinusPrescribedMl: input.actualRecordedTransfusedMl - v,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyMeasuredRecipientMassKg: 10,
    callerVeterinarianPrescribedTransfusionMlPerKg: 5,
    actualRecordedTransfusedMl: 40,
  },
  output: {
    result: {
      conditionalPrescribedTransfusionMl: 50,
      signedActualMinusPrescribedMl: -10,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "veterinary/transfusion-dose-ml-per-kg",
  title: "Transfusion Dose mL per kg Calculator",
  description:
    "Independent veterinarian transfusion-volume prescription arithmetic and actual delivery discrepancy, not choose blood product, trigger, target PCV, rate or patient compatibility/safety.",
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
