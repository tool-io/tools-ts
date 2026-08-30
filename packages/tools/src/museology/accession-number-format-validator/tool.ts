import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, accession } from "../shared.js";
export type Input = Readonly<{ readonly accessionIdentifier: string }>;
export type Output = Readonly<{
  readonly validYearLotItemFormat: boolean;
  readonly parsedYearLotItem: readonly number[];
}>;
const inputFields = [
  { id: "accessionIdentifier", label: "Accession identifier", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (
    !input.accessionIdentifier.length ||
    input.accessionIdentifier.length > 64
  )
    simpleError(
      "identifier",
      "Nonempty bounded accession identifier required.",
    );
  const p = accession(input.accessionIdentifier);
  return {
    validYearLotItemFormat: p !== undefined,
    parsedYearLotItem: p ?? [],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  accessionIdentifier: "2026.12.3",
} satisfies Input;
export const exampleOutput = {
  validYearLotItemFormat: true,
  parsedYearLotItem: [2026, 12, 3],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "museology/accession-number-format-validator",
  title: "Accession Number Format Validator (year.lot.item)",
  description:
    "Validate exact ASCII YYYY.lot.item with year 1000–9999, positive no-leading-zero lot/item up to nine digits; reports malformed nonempty identifier as invalid without inventing corrected identity.",
  inputs: inputFields,
  outputs: [
    {
      id: "validYearLotItemFormat",
      label: "Valid year lot item format",
      kind: "boolean",
    },
    {
      id: "parsedYearLotItem",
      label: "Parsed year lot item",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({ accessionIdentifier: value.accessionIdentifier as string }),
});
export const run = tool.execute;
export default tool;
