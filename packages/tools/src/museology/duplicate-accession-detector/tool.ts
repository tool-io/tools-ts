import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, lines, accession } from "../shared.js";
export type Input = Readonly<{ readonly recordAccessionIdentifiers: string }>;
export type Output = Readonly<{
  readonly duplicateAccessionIdentifiers: readonly string[];
  readonly conflictingRecordIndices: readonly number[];
  readonly uniqueAccessionCount: number;
}>;
const inputFields = [
  {
    id: "recordAccessionIdentifiers",
    label: "Record accession identifiers",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const ids = lines(input.recordAccessionIdentifiers, "records");
  if (ids.some((s) => !accession(s)))
    simpleError(
      "identifiers",
      "Strict accession formats required before conflict detection.",
    );
  const counts = new Map<string, number>();
  ids.forEach((s) => counts.set(s, (counts.get(s) ?? 0) + 1));
  return {
    duplicateAccessionIdentifiers: [...counts.keys()].filter(
      (s) => counts.get(s)! > 1,
    ),
    conflictingRecordIndices: ids.flatMap((s, i) =>
      counts.get(s)! > 1 ? [i] : [],
    ),
    uniqueAccessionCount: counts.size,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  recordAccessionIdentifiers: "2026.1.1\n2026.1.2\n2026.1.1",
} satisfies Input;
export const exampleOutput = {
  duplicateAccessionIdentifiers: ["2026.1.1"],
  conflictingRecordIndices: [0, 2],
  uniqueAccessionCount: 2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "museology/duplicate-accession-detector",
  title: "Duplicate Accession Conflict Detector",
  description:
    "Detect exact strict accession identity conflicts across source rows without silently normalizing malformed identifiers; no conflict resolution or ownership decision.",
  inputs: inputFields,
  outputs: [
    {
      id: "duplicateAccessionIdentifiers",
      label: "Duplicate accession identifiers",
      kind: "stringList",
    },
    {
      id: "conflictingRecordIndices",
      label: "Conflicting record indices",
      kind: "numberList",
    },
    {
      id: "uniqueAccessionCount",
      label: "Unique accession count",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      recordAccessionIdentifiers: value.recordAccessionIdentifiers as string,
    }),
});
export const run = tool.execute;
export default tool;
