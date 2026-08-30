import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LogAnalysisSampleInput = {
  readonly logRows: ReadonlyArray<ReadonlyArray<number>>;
};

export type LogAnalysisSampleOutput = {
  readonly complete: boolean;
  readonly issueCount: number;
  readonly issueRowIndices: ReadonlyArray<number>;
  readonly logsChecked: number;
};

export const testLogAnalysisSample = (
  input: LogAnalysisSampleInput,
): LogAnalysisSampleOutput => {
  if (!Array.isArray(input.logRows))
    simpleError("logRows", "Log rows must be an array.", "log_rows_required");
  const issueRowIndices: number[] = [];
  for (const [index, row] of input.logRows.entries()) {
    if (!Array.isArray(row) || row.length !== 6)
      simpleError(
        `logRows.${index}`,
        "Each row must contain user, role, event type, timestamp, result, and source flags.",
        "invalid_log_row",
      );
    for (const [column, value] of row.entries())
      if (value !== 0 && value !== 1)
        simpleError(
          `logRows.${index}.${column}`,
          "Log fields must be 0 or 1.",
          "invalid_log_flag",
        );
    if (row.some((value) => value !== 1)) issueRowIndices.push(index);
  }
  return {
    complete: issueRowIndices.length === 0,
    issueCount: issueRowIndices.length,
    issueRowIndices,
    logsChecked: input.logRows.length,
  };
};

export const logAnalysisSampleExample = {
  input: {
    logRows: [
      [1, 1, 1, 1, 1, 1],
      [1, 1, 0, 1, 1, 1],
    ],
  },
  output: {
    complete: false,
    issueCount: 1,
    issueRowIndices: [1],
    logsChecked: 2,
  },
} satisfies ToolExample<LogAnalysisSampleInput, LogAnalysisSampleOutput>;

export const logAnalysisSampleTool = createSimpleTool({
  calculate: (input) =>
    testLogAnalysisSample({ logRows: input.logRows as number[][] }),
  description:
    "Check sampled ITGC log rows for user, role, event type, timestamp, result, and source completeness.",
  id: "auditing/log-analysis-user-role-itgc-sample-extraction-steps",
  inputs: [
    {
      description:
        "Rows ordered as user, role, event type, timestamp, result, and source-present flags.",
      id: "logRows",
      kind: "matrix",
      label: "Log analysis sample",
    },
  ],
  outputs: [
    { id: "complete", kind: "boolean", label: "Log sample complete" },
    {
      id: "issueCount",
      kind: "integer",
      label: "Incomplete log rows",
      minimum: 0,
    },
    {
      id: "issueRowIndices",
      kind: "numberList",
      label: "Incomplete row indices",
    },
    { id: "logsChecked", kind: "integer", label: "Logs checked", minimum: 0 },
  ],
  title: "Log Analysis User Role ITGC Sample Extraction Steps",
});

export const runLogAnalysisSample = logAnalysisSampleTool.execute;
export default logAnalysisSampleTool;
