import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  count,
  lines,
  nextFree,
  accession,
} from "../shared.js";
export type Input = Readonly<{
  readonly existingAccessionIdentifiers: string;
  readonly accessionYear: number;
  readonly minimumLotNumber: number;
}>;
export type Output = Readonly<{
  readonly nextUnoccupiedLotNumber: number;
  readonly usedLotsInYear: readonly number[];
}>;
const inputFields = [
  {
    id: "existingAccessionIdentifiers",
    label: "Existing accession identifiers",
    kind: "string",
  },
  { id: "accessionYear", label: "Accession year", kind: "integer" },
  { id: "minimumLotNumber", label: "Minimum lot number", kind: "integer" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.minimumLotNumber, "minimumLotNumber");
  count(input.accessionYear, "accessionYear");
  count(input.minimumLotNumber, "minimumLotNumber");
  if (input.minimumLotNumber > 999999999)
    simpleError(
      "lot",
      "Lot number must fit the declared nine-digit accession convention.",
    );
  if (input.accessionYear < 1000 || input.accessionYear > 9999)
    simpleError("year", "Four-digit accession year required.");
  const ids = lines(
    input.existingAccessionIdentifiers,
    "identifiers",
    true,
  ).map((s) => {
    const p = accession(s);
    if (!p)
      return simpleError(
        "identifiers",
        "Every existing accession must have strict year.lot.item format.",
      );
    return p;
  });
  const used = [
    ...new Set(
      ids.filter((p) => p[0] === input.accessionYear).map((p) => p[1]),
    ),
  ].sort((a, b) => a - b);
  const next = nextFree(used, input.minimumLotNumber);
  if (next > 999999999)
    simpleError(
      "lot",
      "No available lot inside the declared accession convention.",
    );
  return {
    nextUnoccupiedLotNumber: next,
    usedLotsInYear: used,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  existingAccessionIdentifiers: "2025.1.1\n2026.1.1\n2026.3.2",
  accessionYear: 2026,
  minimumLotNumber: 1,
} satisfies Input;
export const exampleOutput = {
  nextUnoccupiedLotNumber: 2,
  usedLotsInYear: [1, 3],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "museology/lot-number-next-finder",
  title: "Lot Number Next Available Finder",
  description:
    "Find earliest unused lot in a declared accession year from actual strict item identifiers, allowing multiple items per lot; does not allocate or reserve a concurrent database identity.",
  inputs: inputFields,
  outputs: [
    {
      id: "nextUnoccupiedLotNumber",
      label: "Next unoccupied lot number",
      kind: "number",
    },
    { id: "usedLotsInYear", label: "Used lots in year", kind: "numberList" },
  ],
  calculate: (value) =>
    calculate({
      existingAccessionIdentifiers:
        value.existingAccessionIdentifiers as string,
      accessionYear: value.accessionYear as number,
      minimumLotNumber: value.minimumLotNumber as number,
    }),
});
export const run = tool.execute;
export default tool;
