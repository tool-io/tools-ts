import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly statuses: readonly string[];
}>;
export type Output = Readonly<{
  readonly openCount: number;
  readonly inProgressCount: number;
  readonly completeCount: number;
  readonly blockedCount: number;
  readonly unknownCount: number;
}>;

export const calculate = (input: Input): Output => {
  const normalized = input.statuses.map((value) => value.trim().toLowerCase());
  const count = (value: string) =>
    normalized.filter((status) => status === value).length;
  const known = new Set(["open", "in-progress", "complete", "blocked"]);
  return {
    openCount: count("open"),
    inProgressCount: count("in-progress"),
    completeCount: count("complete"),
    blockedCount: count("blocked"),
    unknownCount: normalized.filter((status) => !known.has(status)).length,
  };
};

export const exampleInput = {
  statuses: ["open", "complete", "in-progress", "blocked", "complete"],
} satisfies Input;
export const example = {
  input: exampleInput,
  output: calculate(exampleInput),
} satisfies ToolExample<Input, Output>;
export const edgeCase = { statuses: ["other"] } satisfies Input;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      statuses: input.statuses as readonly string[],
    }),
  description:
    "Summarize caller-supplied PBC request statuses into stable status counts.",
  id: "auditing/pbc-request-status-summary",
  inputs: [
    { id: "statuses", label: "PBC request statuses", kind: "stringList" },
  ],
  outputs: [
    { id: "openCount", label: "Open count", kind: "integer", minimum: 0 },
    {
      id: "inProgressCount",
      label: "In-progress count",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "completeCount",
      label: "Complete count",
      kind: "integer",
      minimum: 0,
    },
    { id: "blockedCount", label: "Blocked count", kind: "integer", minimum: 0 },
    { id: "unknownCount", label: "Unknown count", kind: "integer", minimum: 0 },
  ],
  title: "PBC Request Status Summary",
});

export const run = tool.execute;
export default tool;
