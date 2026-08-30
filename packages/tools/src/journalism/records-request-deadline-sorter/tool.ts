import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly requests: readonly string[];
  readonly asOfDate: string;
}>;
export type Output = Readonly<{
  readonly sortedRequests: readonly string[];
  readonly overdueAgencies: readonly string[];
  readonly daysUntilNextDeadline: number;
}>;

export const calculate = (input: Input): Output => {
  const asOf = Date.parse(`${input.asOfDate}T00:00:00Z`);
  if (Number.isNaN(asOf))
    simpleError("asOfDate", "As-of date must be an ISO date.", "invalid_date");
  const rows = input.requests
    .map((record, index) => {
      const [agency, date] = record.split("|");
      const time = Date.parse(`${date}T00:00:00Z`);
      if (!agency?.trim() || Number.isNaN(time))
        simpleError(
          "requests",
          `Request ${index + 1} must use agency|YYYY-MM-DD format.`,
          "invalid_request",
        );
      return { record, agency: agency.trim(), time };
    })
    .sort((a, b) => a.time - b.time);
  const next = rows.find((row) => row.time >= asOf);
  return {
    sortedRequests: rows.map((row) => row.record),
    overdueAgencies: rows
      .filter((row) => row.time < asOf)
      .map((row) => row.agency),
    daysUntilNextDeadline: next ? Math.ceil((next.time - asOf) / 86400000) : -1,
  };
};

export const exampleInput = {
  requests: ["Transit|2025-03-15", "Police|2025-02-20", "Parks|2025-04-01"],
  asOfDate: "2025-03-01",
} satisfies Input;
export const exampleOutput = {
  sortedRequests: [
    "Police|2025-02-20",
    "Transit|2025-03-15",
    "Parks|2025-04-01",
  ],
  overdueAgencies: ["Police"],
  daysUntilNextDeadline: 14,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      requests: input.requests as readonly string[],
      asOfDate: input.asOfDate as string,
    }),
  description:
    "Parse and sort agency request deadlines, identify overdue agencies, and find the next due date.",
  id: "journalism/records-request-deadline-sorter",
  inputs: [
    { id: "requests", label: "Agency deadline records", kind: "stringList" },
    { id: "asOfDate", label: "As-of date", kind: "string" },
  ],
  outputs: [
    {
      id: "sortedRequests",
      label: "Requests sorted by deadline",
      kind: "stringList",
    },
    { id: "overdueAgencies", label: "Overdue agencies", kind: "stringList" },
    {
      id: "daysUntilNextDeadline",
      label: "Days until next deadline",
      kind: "integer",
    },
  ],
  title: "Records Request Deadline Sorter",
});

export const run = tool.execute;
export default tool;
