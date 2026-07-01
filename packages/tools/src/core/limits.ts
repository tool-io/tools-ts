import type { ToolIssue } from "./result.js";

export const toolResourceLimits = {
  fileBytes: 10 * 1024 * 1024,
  generatedValues: 100_000,
  graphEdges: 100_000,
  graphNodes: 10_000,
  iterations: 1_000_000,
  matrixCells: 16_384,
  matrixDimension: 128,
  samples: 100_000,
  textCharacters: 1_000_000,
} as const;

export type ToolResource = keyof typeof toolResourceLimits;

export const resourceLimitIssue = (
  resource: ToolResource,
  actual: number,
  path: string,
): ToolIssue | undefined => {
  const limit = toolResourceLimits[resource];
  return Number.isSafeInteger(actual) && actual >= 0 && actual <= limit
    ? undefined
    : {
        code: "resource_limit_exceeded",
        field: path,
        message: `${path || resource} must not exceed ${limit.toLocaleString("en-US")}.`,
      };
};

export const matrixLimitIssues = (
  rows: number,
  columns: number,
  path = "matrix",
): readonly ToolIssue[] =>
  [
    resourceLimitIssue("matrixDimension", rows, `${path}.rows`),
    resourceLimitIssue("matrixDimension", columns, `${path}.columns`),
    resourceLimitIssue("matrixCells", rows * columns, path),
  ].filter((issue): issue is ToolIssue => issue !== undefined);
