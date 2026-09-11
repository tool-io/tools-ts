import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch47-shared.js";
export type Input = Readonly<{
  readonly independentlyMeasuredAnimalMassKg: number;
  readonly callerVeterinarianApplicableWaterMlPerKgPerDay: number;
  readonly actualRecordedWaterMl: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyMeasuredAnimalMassKg",
    label: "Independently measured animal mass kg",
    kind: "number",
  },
  {
    id: "callerVeterinarianApplicableWaterMlPerKgPerDay",
    label: "Caller veterinarian applicable water ml per kg per day",
    kind: "number",
  },
  {
    id: "actualRecordedWaterMl",
    label: "Actual recorded water ml",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.independentlyMeasuredAnimalMassKg, "mass");
  positive(
    input.callerVeterinarianApplicableWaterMlPerKgPerDay,
    "clinical-coefficient",
  );
  nonnegative(input.actualRecordedWaterMl, "actual");
  const t =
    input.independentlyMeasuredAnimalMassKg *
    input.callerVeterinarianApplicableWaterMlPerKgPerDay;
  return {
    conditionalCallerDailyWaterVolumeMl: t,
    signedRecordedMinusCallerVolumeMl: input.actualRecordedWaterMl - t,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyMeasuredAnimalMassKg: 10,
    callerVeterinarianApplicableWaterMlPerKgPerDay: 40,
    actualRecordedWaterMl: 300,
  },
  output: {
    result: {
      conditionalCallerDailyWaterVolumeMl: 400,
      signedRecordedMinusCallerVolumeMl: -100,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "veterinary/water-requirement-daily-pet",
  title: "Daily Pet Water Requirement Calculator",
  description:
    "Conditional daily water bookkeeping using independently veterinarian applicable volume/kgcoefficient versus actual recorded intake. Not universal requirement, hydration diagnosis, fluid restriction or instruction to force water.",
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
