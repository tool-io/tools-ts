import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  instants,
  instant,
  literal,
  bounded,
  aligned,
} from "../batch-shared.js";
export type Input = Readonly<{
  readonly existingChangeUtc: readonly string[];
  readonly existingChangeKinds: readonly string[];
  readonly existingChangeNotes: readonly string[];
  readonly newChangeUtc: string;
  readonly newChangeKind: string;
  readonly newChangeNote: string;
}>;
export type Output = Readonly<{
  readonly appendedChangeLogJsonLines: string;
  readonly appendedChangeCount: number;
}>;
const inputFields = [
  { id: "existingChangeUtc", label: "Existing change utc", kind: "stringList" },
  {
    id: "existingChangeKinds",
    label: "Existing change kinds",
    kind: "stringList",
  },
  {
    id: "existingChangeNotes",
    label: "Existing change notes",
    kind: "stringList",
  },
  { id: "newChangeUtc", label: "New change utc", kind: "string" },
  { id: "newChangeKind", label: "New change kind", kind: "string" },
  { id: "newChangeNote", label: "New change note", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (
    input.existingChangeUtc.length !== input.existingChangeKinds.length ||
    input.existingChangeUtc.length !== input.existingChangeNotes.length
  )
    simpleError(
      "changes",
      "Aligned history required; empty history permits the first observed append.",
    );
  const times = instants(input.existingChangeUtc),
    next = instant(input.newChangeUtc);
  if (
    times.some((v, i) => i > 0 && v < times[i - 1]) ||
    (times.length && next < times[times.length - 1])
  )
    simpleError(
      "chronology",
      "Nondecreasing append-only UTC chronology required.",
    );
  const kinds = [...input.existingChangeKinds, input.newChangeKind],
    notes = [...input.existingChangeNotes, input.newChangeNote];
  kinds.forEach((v) =>
    literal(v, ["update", "correction", "clarification"], "kind"),
  );
  if (notes.some((s) => !s.trim()) || input.newChangeNote.length > 4096)
    simpleError("notes", "Nonempty bounded observed change notes required.");
  const dates = [...input.existingChangeUtc, input.newChangeUtc];
  return {
    appendedChangeLogJsonLines: dates
      .map((at, i) => JSON.stringify({ at, kind: kinds[i], note: notes[i] }))
      .join("\n"),
    appendedChangeCount: dates.length,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  existingChangeUtc: ["2025-01-01T00:00:00Z"],
  existingChangeKinds: ["update"],
  existingChangeNotes: ["Added context"],
  newChangeUtc: "2025-01-01T01:00:00Z",
  newChangeKind: "correction",
  newChangeNote: "Fixed count",
} satisfies Input;
export const exampleOutput = {
  appendedChangeLogJsonLines:
    '{"at":"2025-01-01T00:00:00Z","kind":"update","note":"Added context"}\n{"at":"2025-01-01T01:00:00Z","kind":"correction","note":"Fixed count"}',
  appendedChangeCount: 2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "journalism/update-stamp-correction-changelog-append-format-lookup",
  title: "Update Stamp Correction Changelog Append Format Lookup",
  description:
    "Append actual caller supplied update/correction/clarification evidence to bounded chronological JSON-lines record with safe string escaping; no automatic label classification, factual verification, filesystem write or universal publication style.",
  inputs: inputFields,
  outputs: [
    {
      id: "appendedChangeLogJsonLines",
      label: "Appended change log json lines",
      kind: "string",
    },
    {
      id: "appendedChangeCount",
      label: "Appended change count",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      existingChangeUtc: value.existingChangeUtc as readonly string[],
      existingChangeKinds: value.existingChangeKinds as readonly string[],
      existingChangeNotes: value.existingChangeNotes as readonly string[],
      newChangeUtc: value.newChangeUtc as string,
      newChangeKind: value.newChangeKind as string,
      newChangeNote: value.newChangeNote as string,
    }),
});
export const run = tool.execute;
export default tool;
