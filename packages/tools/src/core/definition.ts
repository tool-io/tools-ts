import type { ToolResult } from "./result.js";
import type { ToolSemanticType } from "./semantic-type.js";
import type { ToolValueType } from "./value-type.js";

export type ToolJsonSchema = Readonly<Record<string, unknown>>;

export type ToolExecutionKind = "data-backed" | "device" | "pure" | "remote";

export type ToolPortDefinition = {
  readonly description?: string;
  readonly id: string;
  readonly label: string;
  readonly path?: readonly string[];
  readonly required?: boolean;
  readonly type: ToolSemanticType;
  readonly valueType?: ToolValueType;
};

export type ToolPortsDefinition = {
  readonly inputs: readonly ToolPortDefinition[];
  readonly outputs: readonly ToolPortDefinition[];
};

export type ToolDefinition<Input, Output> = {
  readonly contractVersion: number;
  readonly description: string;
  readonly execute: (input: unknown) => ToolResult<Output>;
  readonly executionKind: ToolExecutionKind;
  readonly id: string;
  readonly inputSchema: ToolJsonSchema;
  readonly isOutput: (value: unknown) => value is Output;
  readonly outputSchema: ToolJsonSchema;
  readonly ports?: ToolPortsDefinition;
  readonly title: string;
};

export const defineTool = <Input, Output>(
  definition: ToolDefinition<Input, Output>,
): ToolDefinition<Input, Output> => definition;
