import type { ToolResult } from "./result.js";
import type { ToolValueType } from "./value-type.js";

export type ToolJsonSchemaType =
  "array" | "boolean" | "integer" | "null" | "number" | "object" | "string";

export type ToolJsonSchema = {
  readonly additionalProperties?: boolean | ToolJsonSchema;
  readonly anyOf?: readonly ToolJsonSchema[];
  readonly const?: unknown;
  readonly default?: unknown;
  readonly description?: string;
  readonly enum?: readonly unknown[];
  readonly exclusiveMaximum?: number;
  readonly exclusiveMinimum?: number;
  readonly items?: ToolJsonSchema;
  readonly maximum?: number;
  readonly maxItems?: number;
  readonly maxLength?: number;
  readonly minimum?: number;
  readonly minItems?: number;
  readonly minLength?: number;
  readonly pattern?: string;
  readonly properties?: Readonly<Record<string, ToolJsonSchema>>;
  readonly required?: readonly string[];
  readonly type?: ToolJsonSchemaType;
};

export type ToolExecutionKind = "data" | "device" | "pure" | "remote";

export type ToolDatasetRequirement = {
  readonly id: string;
  readonly schemaVersion: number;
};

/**
 * A versioned capability that a consuming surface must provide before it can
 * execute a device- or remote-backed tool. Permission prompts and platform
 * implementation details deliberately remain surface-owned.
 */
export type ToolCapabilityRequirement = {
  readonly id: string;
  readonly required: boolean;
  readonly schemaVersion: number;
};

export type ToolExecutionRequirements = {
  readonly capabilities?: readonly ToolCapabilityRequirement[];
  readonly datasets?: readonly ToolDatasetRequirement[];
  readonly kind: ToolExecutionKind;
};

export type ToolDiscovery = {
  readonly aliases?: readonly string[];
  readonly collections?: readonly string[];
  readonly fields?: readonly string[];
  readonly keywords?: readonly string[];
};

export type ToolCancellationSignal = {
  readonly aborted: boolean;
};

export type ToolProgress = {
  readonly completed: number;
  readonly message?: string;
  readonly total?: number;
};

export type ToolExecutionContext = {
  readonly locale?: string;
  readonly now?: () => number;
  readonly random?: () => number;
  readonly reportProgress?: (progress: ToolProgress) => void;
  readonly signal?: ToolCancellationSignal;
  readonly timeZone?: string;
};

export type ToolPortDefinition = {
  readonly description?: string;
  readonly id: string;
  readonly label: string;
  readonly path?: readonly string[];
  readonly required?: boolean;
  readonly valueType: ToolValueType;
};

export type ToolPortsDefinition = {
  readonly inputs: readonly ToolPortDefinition[];
  readonly outputs: readonly ToolPortDefinition[];
};

/**
 * JSON-compatible metadata shared by every Tool.io runtime and surface.
 * Keep executable functions and surface-specific presentation out of this
 * contract so it can be published for non-TypeScript consumers.
 */
export type ToolContract = {
  readonly contractVersion: number;
  readonly description: string;
  readonly discovery?: ToolDiscovery;
  readonly execution: ToolExecutionRequirements;
  readonly id: string;
  readonly inputSchema: ToolJsonSchema;
  readonly outputSchema: ToolJsonSchema;
  readonly ports: ToolPortsDefinition;
  readonly title: string;
};

export type ToolDefinition<Input, Output> = ToolContract & {
  readonly execute: (
    input: unknown,
    context?: ToolExecutionContext,
  ) => ToolResult<Output>;
};

export const defineTool = <Input, Output>(
  definition: ToolDefinition<Input, Output>,
): ToolDefinition<Input, Output> => definition;
