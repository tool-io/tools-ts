import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  shiftDate,
} from "../batch47-shared.js";
export type Input = Readonly<{
  readonly actualRecordedMatingDate: string;
  readonly callerVeterinarianEstablishedEarliestMatingToBirthDays: number;
  readonly callerVeterinarianEstablishedLatestMatingToBirthDays: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualRecordedMatingDate",
    label: "Actual recorded mating date",
    kind: "string",
  },
  {
    id: "callerVeterinarianEstablishedEarliestMatingToBirthDays",
    label: "Caller veterinarian established earliest mating to birth days",
    kind: "number",
  },
  {
    id: "callerVeterinarianEstablishedLatestMatingToBirthDays",
    label: "Caller veterinarian established latest mating to birth days",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  bounded(
    input.callerVeterinarianEstablishedEarliestMatingToBirthDays,
    "earliest",
    1,
    500,
  );
  bounded(
    input.callerVeterinarianEstablishedLatestMatingToBirthDays,
    "latest",
    input.callerVeterinarianEstablishedEarliestMatingToBirthDays,
    500,
  );
  return {
    conditionalCallerEarliestBirthDate: shiftDate(
      input.actualRecordedMatingDate,
      input.callerVeterinarianEstablishedEarliestMatingToBirthDays,
    ),
    conditionalCallerLatestBirthDate: shiftDate(
      input.actualRecordedMatingDate,
      input.callerVeterinarianEstablishedLatestMatingToBirthDays,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualRecordedMatingDate: "2026-01-01",
    callerVeterinarianEstablishedEarliestMatingToBirthDays: 60,
    callerVeterinarianEstablishedLatestMatingToBirthDays: 70,
  },
  output: {
    result: {
      conditionalCallerEarliestBirthDate: "2026-03-02",
      conditionalCallerLatestBirthDate: "2026-03-12",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "veterinary/queening-date-from-mating",
  title: "Queening Date From Mating Calculator",
  description:
    "Conditional feline queening calendar window from actual mating and independently veterinarian established applicable earliest/latest intervals. Mating not fertilization, date uncertainty retained; no guaranteed birth date, pregnancy confirmation or permission to delay care.",
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
