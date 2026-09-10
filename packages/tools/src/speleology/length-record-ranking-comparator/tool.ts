import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, ranking } from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualCaveRecordIds: readonly string[];
  readonly independentlyVerifiedRecordValuesMeters: readonly number[];
  readonly recordEvidenceKnownFlags: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualCaveRecordIds",
    label: "Actual cave record ids",
    kind: "stringList",
  },
  {
    id: "independentlyVerifiedRecordValuesMeters",
    label: "Independently verified record values meters",
    kind: "numberList",
  },
  {
    id: "recordEvidenceKnownFlags",
    label: "Record evidence known flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return ranking(
    input.actualCaveRecordIds,
    input.independentlyVerifiedRecordValuesMeters,
    input.recordEvidenceKnownFlags,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualCaveRecordIds: ["a", "b", "c"],
    independentlyVerifiedRecordValuesMeters: [10, 10, 3],
    recordEvidenceKnownFlags: [1, 1, 0],
  },
  output: {
    result: {
      rankedKnownIds: ["a", "b"],
      competitionRanks: [1, 1],
      unknownIds: ["c"],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "speleology/length-record-ranking-comparator",
  title: "Length Record Ranking Comparator",
  description:
    "Actual actual unique mapped cave length inventory competition ranking, ties and unknown evidence retained. Reference date/coverage and actual survey conventions external; not global authoritative record.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observed calculation or explicit reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
