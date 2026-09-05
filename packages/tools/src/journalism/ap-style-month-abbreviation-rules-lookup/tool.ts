import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly monthOneBased: number;
  readonly callerSpecificDayPresent: boolean;
}>;
export type Output = Readonly<{ readonly basicApMonthToken: string }>;
const inputFields = [
  { id: "monthOneBased", label: "Month one based", kind: "number" },
  {
    id: "callerSpecificDayPresent",
    label: "Caller specific day present",
    kind: "boolean",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  bounded(input.monthOneBased, "month", 1, 12);
  const long = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    short = [
      "Jan.",
      "Feb.",
      "March",
      "April",
      "May",
      "June",
      "July",
      "Aug.",
      "Sept.",
      "Oct.",
      "Nov.",
      "Dec.",
    ];
  return {
    basicApMonthToken: (input.callerSpecificDayPresent ? short : long)[
      input.monthOneBased - 1
    ],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  monthOneBased: 9,
  callerSpecificDayPresent: true,
} satisfies Input;
export const exampleOutput = { basicApMonthToken: "Sept." } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "journalism/ap-style-month-abbreviation-rules-lookup",
  title: "AP Style Month Abbreviation Rules Lookup",
  description:
    "Basic AP prose month abbreviation with a specific date; March–July stay unabbreviated, no table-layout or other editorial exceptions. Caller independently verifies context, evidence, reference edition and applicability; not factual authenticity, current legal advice or publication clearance.",
  inputs: inputFields,
  outputs: [
    { id: "basicApMonthToken", label: "Basic ap month token", kind: "string" },
  ],
  calculate: (value) =>
    calculate({
      monthOneBased: value.monthOneBased as number,
      callerSpecificDayPresent: value.callerSpecificDayPresent as boolean,
    }),
});
export const run = tool.execute;
export default tool;
