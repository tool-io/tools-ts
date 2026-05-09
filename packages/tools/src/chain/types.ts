import type {
  ToolDefinition,
  ToolPortDefinition,
  ToolPortsDefinition,
} from "../core/definition.js";
import type { ToolResult } from "../core/result.js";

export type JsonPrimitive = boolean | number | string | null;
export type JsonValue =
  | JsonPrimitive
  | readonly JsonValue[]
  | { readonly [key: string]: JsonValue };

export type ChainNode = {
  readonly id: string;
  readonly inputs: Readonly<Record<string, JsonValue>>;
  readonly toolId: string;
  readonly toolVersion: number;
};

export type ChainEndpoint = {
  readonly nodeId: string;
  readonly portId: string;
};

export type ChainEdge = {
  readonly from: ChainEndpoint;
  readonly to: ChainEndpoint;
};

export type ChainDocument = {
  readonly edges: readonly ChainEdge[];
  readonly nodes: readonly ChainNode[];
  readonly version: 1;
};

export type ChainToolDefinition = Omit<
  ToolDefinition<unknown, unknown>,
  "execute" | "ports"
> & {
  readonly execute: (
    input: unknown,
  ) => ToolResult<unknown> | Promise<ToolResult<unknown>>;
  readonly ports: ToolPortsDefinition;
};

export type ChainToolResolver = (
  toolId: string,
) => ChainToolDefinition | Promise<ChainToolDefinition | undefined> | undefined;

export type ChainValidationIssue = {
  readonly code: string;
  readonly edgeIndex?: number;
  readonly message: string;
  readonly nodeId?: string;
  readonly portId?: string;
};

export type ChainValidationResult =
  | {
      readonly issues: readonly [];
      readonly ok: true;
    }
  | {
      readonly issues: readonly ChainValidationIssue[];
      readonly ok: false;
    };

export type ChainNodeExecution = {
  readonly id: string;
  readonly output: JsonValue;
  readonly outputs: Readonly<Record<string, JsonValue>>;
  readonly status: "succeeded";
  readonly toolId: string;
  readonly toolVersion: number;
};

export type ChainExecutionError = {
  readonly code:
    | "chain_aborted"
    | "chain_invalid"
    | "node_failed"
    | "node_threw"
    | "output_invalid";
  readonly issues: readonly ChainValidationIssue[];
  readonly message: string;
  readonly nodeId?: string;
  readonly toolError?: JsonValue;
};

export type ChainExecutionResult =
  | {
      readonly error: ChainExecutionError;
      readonly nodes: readonly ChainNodeExecution[];
      readonly ok: false;
    }
  | {
      readonly nodes: readonly ChainNodeExecution[];
      readonly ok: true;
      readonly version: 1;
    };

export type ChainExecutionOptions = {
  readonly resolveTool: ChainToolResolver;
  readonly signal?: { readonly aborted: boolean };
};

export type ChainConnectorCandidate = {
  readonly inputPortId: string;
  readonly outputPortId: string;
  readonly requiredInputPortIds: readonly string[];
  readonly title: string;
  readonly toolId: string;
  readonly toolVersion: number;
};

export type ChainConnectionRecommendation = {
  readonly connectors: readonly ChainConnectorCandidate[];
  readonly direct: boolean;
};

export type ResolvedChainNode = {
  readonly node: ChainNode;
  readonly tool: ChainToolDefinition;
};

export type ResolvedChain = {
  readonly document: ChainDocument;
  readonly nodes: ReadonlyMap<string, ResolvedChainNode>;
  readonly order: readonly string[];
};

export type { ToolPortDefinition, ToolPortsDefinition };
