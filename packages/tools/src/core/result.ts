export type ToolIssue = {
  readonly code: string;
  readonly field: string;
  readonly message: string;
};

export type ToolInputError = {
  readonly code: 'invalid_input';
  readonly issues: readonly ToolIssue[];
};

export type ToolResult<Output> =
  | {
      readonly ok: true;
      readonly output: Output;
    }
  | {
      readonly error: ToolInputError;
      readonly ok: false;
    };

export const invalidInput = (
  issues: readonly ToolIssue[]
): ToolResult<never> => ({
  error: {
    code: 'invalid_input',
    issues
  },
  ok: false
});

export const toolSuccess = <Output>(
  output: Output
): ToolResult<Output> => ({
  ok: true,
  output
});
