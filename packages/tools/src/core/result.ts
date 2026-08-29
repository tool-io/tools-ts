export type ToolIssue = {
  readonly code: string;
  readonly field: string;
  readonly message: string;
};

export type ToolErrorCode =
  | "capability_unavailable"
  | "dataset_unavailable"
  | "execution_cancelled"
  | "execution_failed"
  | "invalid_input";

export type ToolInputError = {
  readonly code: "invalid_input";
  readonly issues: readonly ToolIssue[];
};

export type ToolExecutionCancelledError = {
  readonly code: "execution_cancelled";
  readonly issues: readonly ToolIssue[];
};

export type ToolExecutionFailedError = {
  readonly code: "execution_failed";
  readonly issues: readonly ToolIssue[];
};

export type ToolCapabilityUnavailableError = {
  readonly capability: {
    readonly id: string;
    readonly schemaVersion: number;
  };
  readonly code: "capability_unavailable";
  readonly issues: readonly ToolIssue[];
};

export type ToolDatasetUnavailableError = {
  readonly code: "dataset_unavailable";
  readonly dataset: {
    readonly id: string;
    readonly schemaVersion: number;
  };
  readonly issues: readonly ToolIssue[];
};

export type ToolError =
  | ToolCapabilityUnavailableError
  | ToolDatasetUnavailableError
  | ToolExecutionCancelledError
  | ToolExecutionFailedError
  | ToolInputError;

export type ToolResult<Output> =
  | {
      readonly ok: true;
      readonly output: Output;
    }
  | {
      readonly error: ToolError;
      readonly ok: false;
    };

export const invalidInput = (
  issues: readonly ToolIssue[],
): ToolResult<never> => ({
  error: {
    code: "invalid_input",
    issues,
  },
  ok: false,
});

export const toolSuccess = <Output>(output: Output): ToolResult<Output> => ({
  ok: true,
  output,
});

export const toolExecutionCancelled = (
  message = "Tool execution was canceled.",
): ToolResult<never> => ({
  error: {
    code: "execution_cancelled",
    issues: [
      {
        code: "execution_cancelled",
        field: "",
        message,
      },
    ],
  },
  ok: false,
});

export const toolExecutionFailed = (
  message = "Tool execution failed.",
): ToolResult<never> => ({
  error: {
    code: "execution_failed",
    issues: [{ code: "execution_failed", field: "", message }],
  },
  ok: false,
});

export const toolCapabilityUnavailable = (
  id: string,
  schemaVersion: number,
  message = `Required capability "${id}" Version ${schemaVersion} is unavailable.`,
): ToolResult<never> => ({
  error: {
    capability: { id, schemaVersion },
    code: "capability_unavailable",
    issues: [{ code: "capability_unavailable", field: "", message }],
  },
  ok: false,
});

export const toolDatasetUnavailable = (
  id: string,
  schemaVersion: number,
  message = `Required dataset "${id}" Version ${schemaVersion} is unavailable.`,
): ToolResult<never> => ({
  error: {
    code: "dataset_unavailable",
    dataset: { id, schemaVersion },
    issues: [{ code: "dataset_unavailable", field: "", message }],
  },
  ok: false,
});
