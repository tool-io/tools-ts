import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly records: readonly string[];
}>;
export type Output = Readonly<{
  readonly sortedRecords: readonly string[];
  readonly uniqueEntities: readonly string[];
  readonly recordCount: number;
}>;

export const calculate = (input: Input): Output => {
  const parsed = input.records.map((record, index) => {
    const [date, entities, ...rest] = record.split("|");
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
      Number.isNaN(Date.parse(`${date}T00:00:00Z`)) ||
      entities === undefined ||
      rest.length === 0
    )
      simpleError(
        "records",
        `Record ${index + 1} must use YYYY-MM-DD|entity1,entity2|summary format.`,
        "invalid_record",
      );
    return {
      record,
      date,
      entities: entities
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean),
    };
  });
  parsed.sort((a, b) => a.date.localeCompare(b.date));
  const uniqueEntities = [
    ...new Set(parsed.flatMap((item) => item.entities)),
  ].sort((a, b) => a.localeCompare(b));
  return {
    sortedRecords: parsed.map((item) => item.record),
    uniqueEntities,
    recordCount: parsed.length,
  };
};

export const exampleInput = {
  records: [
    "2025-03-02|Acme Corp,Alice Jones|Contract signed",
    "2025-01-10|Bob Lee|Filing received",
  ],
} satisfies Input;
export const exampleOutput = {
  sortedRecords: [
    "2025-01-10|Bob Lee|Filing received",
    "2025-03-02|Acme Corp,Alice Jones|Contract signed",
  ],
  uniqueEntities: ["Acme Corp", "Alice Jones", "Bob Lee"],
  recordCount: 2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      records: input.records as readonly string[],
    }),
  description:
    "Parse compact document records, sort them by dateline, and collect unique named entities.",
  id: "journalism/document-entity-date-sorter",
  inputs: [{ id: "records", label: "Document records", kind: "stringList" }],
  outputs: [
    { id: "sortedRecords", label: "Date-sorted records", kind: "stringList" },
    { id: "uniqueEntities", label: "Unique entities", kind: "stringList" },
    { id: "recordCount", label: "Record count", kind: "integer", minimum: 0 },
  ],
  title: "Document Entity Date Sorter",
});

export const run = tool.execute;
export default tool;
