import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, count } from "../shared.js";
export type Input = Readonly<{
  readonly accessionYearSequence: string;
  readonly callerExpectedAccessionYear: number;
}>;
export type Output = Readonly<{
  readonly validYearSequenceFormat: boolean;
  readonly yearMatchesCallerExpectation: boolean;
  readonly parsedYearSequence: readonly number[];
}>;
const inputFields = [
  {
    id: "accessionYearSequence",
    label: "Accession year sequence",
    kind: "string",
  },
  {
    id: "callerExpectedAccessionYear",
    label: "Caller expected accession year",
    kind: "integer",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  count(input.callerExpectedAccessionYear, "callerExpectedAccessionYear");
  if (
    input.callerExpectedAccessionYear < 1000 ||
    input.callerExpectedAccessionYear > 9999 ||
    !input.accessionYearSequence.length ||
    input.accessionYearSequence.length > 64
  )
    simpleError(
      "identifier",
      "Bounded identifier and four-digit expected year required.",
    );
  const m = /^([1-9][0-9]{3})-([1-9][0-9]{0,8})$/.exec(
      input.accessionYearSequence,
    ),
    p = m ? m.slice(1).map(Number) : [];
  return {
    validYearSequenceFormat: m !== null,
    yearMatchesCallerExpectation:
      m !== null && p[0] === input.callerExpectedAccessionYear,
    parsedYearSequence: p,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  accessionYearSequence: "2026-12",
  callerExpectedAccessionYear: 2026,
} satisfies Input;
export const exampleOutput = {
  validYearSequenceFormat: true,
  yearMatchesCallerExpectation: true,
  parsedYearSequence: [2026, 12],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "archival-studies/accession-number-year-validator",
  title: "Accession Number Year Sequence Validator",
  description:
    "Validate strict ASCII YYYY-sequence and caller year without conflating year.lot.item or correcting leading zeros; validation does not reserve identity.",
  inputs: inputFields,
  outputs: [
    {
      id: "validYearSequenceFormat",
      label: "Valid year sequence format",
      kind: "boolean",
    },
    {
      id: "yearMatchesCallerExpectation",
      label: "Year matches caller expectation",
      kind: "boolean",
    },
    {
      id: "parsedYearSequence",
      label: "Parsed year sequence",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      accessionYearSequence: value.accessionYearSequence as string,
      callerExpectedAccessionYear: value.callerExpectedAccessionYear as number,
    }),
});
export const run = tool.execute;
export default tool;
