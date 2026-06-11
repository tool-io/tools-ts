import type { ToolPortDefinition } from "../core/definition.js";
import {
  isToolSemanticType,
  quantityLengthType,
} from "../core/semantic-type.js";
import { isToolValueType, type ToolValueType } from "../core/value-type.js";
import type {
  ChainDocument,
  ChainEdge,
  ChainExecutionOptions,
  ChainExecutionResult,
  ChainNode,
  ChainNodeExecution,
  ChainToolDefinition,
  ChainValidationIssue,
  ChainValidationResult,
  JsonValue,
  ResolvedChain,
  ResolvedChainNode,
} from "./types.js";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export const isJsonValue = (value: unknown): value is JsonValue => {
  if (value === null || typeof value === "string" || typeof value === "boolean")
    return true;
  if (typeof value === "number") return Number.isFinite(value);
  if (Array.isArray(value)) return value.every(isJsonValue);
  if (!isRecord(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  if (prototype !== Object.prototype && prototype !== null) return false;
  return Object.values(value).every(isJsonValue);
};

const areValueTypesCompatible = (
  output: ToolValueType,
  input: ToolValueType,
): boolean =>
  output.type === input.type &&
  (!output.format || !input.format || output.format === input.format) &&
  (!output.unit || !input.unit || output.unit === input.unit) &&
  (output.type !== "list" ||
    !output.items ||
    !input.items ||
    areValueTypesCompatible(output.items, input.items));

export const arePortTypesCompatible = (
  output: ToolPortDefinition,
  input: ToolPortDefinition,
): boolean =>
  output.valueType && input.valueType
    ? areValueTypesCompatible(output.valueType, input.valueType)
    : output.type === input.type ||
      (output.type.startsWith(`${quantityLengthType}/`) &&
        input.type === quantityLengthType) ||
      (output.type === quantityLengthType &&
        input.type.startsWith(`${quantityLengthType}/`));

const isPortDefinition = (value: unknown): value is ToolPortDefinition =>
  isRecord(value) &&
  typeof value.id === "string" &&
  value.id.length > 0 &&
  typeof value.label === "string" &&
  value.label.length > 0 &&
  isToolSemanticType(value.type) &&
  (value.valueType === undefined || isToolValueType(value.valueType)) &&
  (value.path === undefined ||
    (Array.isArray(value.path) &&
      value.path.length > 0 &&
      value.path.every((segment) => typeof segment === "string")));

const hasUniquePortIds = (ports: readonly ToolPortDefinition[]): boolean =>
  new Set(ports.map((port) => port.id)).size === ports.length;

export const isChainToolDefinition = (
  value: unknown,
): value is ChainToolDefinition =>
  isRecord(value) &&
  typeof value.id === "string" &&
  typeof value.contractVersion === "number" &&
  typeof value.execute === "function" &&
  typeof value.isOutput === "function" &&
  isRecord(value.ports) &&
  Array.isArray(value.ports.inputs) &&
  value.ports.inputs.every(isPortDefinition) &&
  hasUniquePortIds(value.ports.inputs) &&
  Array.isArray(value.ports.outputs) &&
  value.ports.outputs.every(isPortDefinition) &&
  hasUniquePortIds(value.ports.outputs);

const isEndpoint = (value: unknown): boolean =>
  isRecord(value) &&
  typeof value.nodeId === "string" &&
  value.nodeId.length > 0 &&
  typeof value.portId === "string" &&
  value.portId.length > 0;

export const isChainDocument = (value: unknown): value is ChainDocument =>
  isRecord(value) &&
  value.version === 1 &&
  Array.isArray(value.nodes) &&
  value.nodes.every(
    (node) =>
      isRecord(node) &&
      typeof node.id === "string" &&
      node.id.length > 0 &&
      typeof node.toolId === "string" &&
      node.toolId.length > 0 &&
      typeof node.toolVersion === "number" &&
      Number.isSafeInteger(node.toolVersion) &&
      node.toolVersion > 0 &&
      isRecord(node.inputs) &&
      isJsonValue(node.inputs),
  ) &&
  Array.isArray(value.edges) &&
  value.edges.every(
    (edge) => isRecord(edge) && isEndpoint(edge.from) && isEndpoint(edge.to),
  );

const portPath = (port: ToolPortDefinition): readonly string[] =>
  port.path ?? [port.id];

const readPath = (
  value: unknown,
  path: readonly string[],
): { readonly found: boolean; readonly value: unknown } => {
  let current = value;
  for (const segment of path) {
    if (!isRecord(current) || !(segment in current))
      return { found: false, value: undefined };
    current = current[segment];
  }
  return { found: true, value: current };
};

const writePath = (
  target: Record<string, unknown>,
  path: readonly string[],
  value: JsonValue,
): void => {
  let current = target;
  for (const segment of path.slice(0, -1)) {
    const child = current[segment];
    if (!isRecord(child)) current[segment] = {};
    current = current[segment] as Record<string, unknown>;
  }
  const last = path.at(-1);
  if (last !== undefined) current[last] = value;
};

const findPort = (
  tool: ChainToolDefinition,
  direction: "inputs" | "outputs",
  portId: string,
): ToolPortDefinition | undefined =>
  tool.ports[direction].find((port) => port.id === portId);

const createOrder = (
  nodes: readonly ChainNode[],
  edges: readonly ChainEdge[],
): readonly string[] | undefined => {
  const index = new Map(nodes.map((node, position) => [node.id, position]));
  const incoming = new Map(nodes.map((node) => [node.id, 0]));
  const outgoing = new Map(nodes.map((node) => [node.id, [] as string[]]));
  for (const edge of edges) {
    if (!incoming.has(edge.to.nodeId) || !outgoing.has(edge.from.nodeId))
      continue;
    incoming.set(edge.to.nodeId, (incoming.get(edge.to.nodeId) ?? 0) + 1);
    outgoing.get(edge.from.nodeId)?.push(edge.to.nodeId);
  }
  const ready = nodes.filter((node) => incoming.get(node.id) === 0);
  const order: string[] = [];
  while (ready.length > 0) {
    ready.sort(
      (first, second) =>
        (index.get(first.id) ?? 0) - (index.get(second.id) ?? 0),
    );
    const node = ready.shift();
    if (!node) break;
    order.push(node.id);
    for (const target of outgoing.get(node.id) ?? []) {
      const remaining = (incoming.get(target) ?? 0) - 1;
      incoming.set(target, remaining);
      if (remaining === 0) {
        const targetNode = nodes.find((candidate) => candidate.id === target);
        if (targetNode) ready.push(targetNode);
      }
    }
  }
  return order.length === nodes.length ? order : undefined;
};

const resolveChain = async (
  value: unknown,
  options: ChainExecutionOptions,
): Promise<
  | { readonly issues: readonly ChainValidationIssue[]; readonly ok: false }
  | { readonly ok: true; readonly resolved: ResolvedChain }
> => {
  if (!isChainDocument(value))
    return {
      issues: [
        {
          code: "invalid_document",
          message: "The chain must be a version 1 JSON document.",
        },
      ],
      ok: false,
    };

  const document = value;
  const issues: ChainValidationIssue[] = [];
  const resolvedNodes = new Map<string, ResolvedChainNode>();
  const duplicateIds = new Set<string>();
  const seenIds = new Set<string>();
  for (const node of document.nodes) {
    if (seenIds.has(node.id)) duplicateIds.add(node.id);
    seenIds.add(node.id);
  }
  for (const id of duplicateIds)
    issues.push({
      code: "duplicate_node_id",
      message: `Node id ${id} is used more than once.`,
      nodeId: id,
    });

  const toolCache = new Map<string, ChainToolDefinition | undefined>();
  for (const node of document.nodes) {
    let tool = toolCache.get(node.toolId);
    if (!toolCache.has(node.toolId)) {
      const candidate = await options.resolveTool(node.toolId);
      tool = isChainToolDefinition(candidate) ? candidate : undefined;
      toolCache.set(node.toolId, tool);
    }
    if (!tool) {
      issues.push({
        code: "tool_not_found",
        message: `Tool ${node.toolId} is unavailable or has no chain ports.`,
        nodeId: node.id,
      });
      continue;
    }
    if (tool.contractVersion !== node.toolVersion)
      issues.push({
        code: "tool_version_mismatch",
        message: `Node expects ${node.toolId} version ${node.toolVersion}, but version ${tool.contractVersion} is available.`,
        nodeId: node.id,
      });
    resolvedNodes.set(node.id, { node, tool });
    for (const [portId, input] of Object.entries(node.inputs)) {
      if (!findPort(tool, "inputs", portId))
        issues.push({
          code: "input_port_not_found",
          message: `Input port ${portId} does not exist on ${tool.id}.`,
          nodeId: node.id,
          portId,
        });
      if (!isJsonValue(input))
        issues.push({
          code: "input_not_json",
          message: `Input ${portId} is not JSON-serializable.`,
          nodeId: node.id,
          portId,
        });
    }
  }

  const connectedInputs = new Set<string>();
  document.edges.forEach((edge, edgeIndex) => {
    const source = resolvedNodes.get(edge.from.nodeId);
    const target = resolvedNodes.get(edge.to.nodeId);
    if (!source)
      issues.push({
        code: "source_node_not_found",
        edgeIndex,
        message: `Source node ${edge.from.nodeId} does not exist.`,
        nodeId: edge.from.nodeId,
      });
    if (!target)
      issues.push({
        code: "target_node_not_found",
        edgeIndex,
        message: `Target node ${edge.to.nodeId} does not exist.`,
        nodeId: edge.to.nodeId,
      });
    if (!source || !target) return;
    const outputPort = findPort(source.tool, "outputs", edge.from.portId);
    const inputPort = findPort(target.tool, "inputs", edge.to.portId);
    if (!outputPort)
      issues.push({
        code: "output_port_not_found",
        edgeIndex,
        message: `Output port ${edge.from.portId} does not exist on ${source.tool.id}.`,
        nodeId: source.node.id,
        portId: edge.from.portId,
      });
    if (!inputPort)
      issues.push({
        code: "input_port_not_found",
        edgeIndex,
        message: `Input port ${edge.to.portId} does not exist on ${target.tool.id}.`,
        nodeId: target.node.id,
        portId: edge.to.portId,
      });
    const targetKey = `${edge.to.nodeId}:${edge.to.portId}`;
    if (connectedInputs.has(targetKey))
      issues.push({
        code: "multiple_input_connections",
        edgeIndex,
        message: `Input ${edge.to.portId} already has a connection.`,
        nodeId: edge.to.nodeId,
        portId: edge.to.portId,
      });
    connectedInputs.add(targetKey);
  });

  for (const { node, tool } of resolvedNodes.values())
    for (const port of tool.ports.inputs)
      if (
        port.required &&
        !(port.id in node.inputs) &&
        !connectedInputs.has(`${node.id}:${port.id}`)
      )
        issues.push({
          code: "required_input_missing",
          message: `Required input ${port.id} has no value or connection.`,
          nodeId: node.id,
          portId: port.id,
        });

  const order = createOrder(document.nodes, document.edges);
  if (!order)
    issues.push({
      code: "cycle_detected",
      message: "The chain contains a cycle.",
    });
  if (issues.length > 0) return { issues, ok: false };
  return {
    ok: true,
    resolved: { document, nodes: resolvedNodes, order: order ?? [] },
  };
};

export const validateChain = async (
  document: unknown,
  options: ChainExecutionOptions,
): Promise<ChainValidationResult> => {
  const result = await resolveChain(document, options);
  return result.ok
    ? { issues: [], ok: true }
    : { issues: result.issues, ok: false };
};

const serializableError = (value: unknown): JsonValue =>
  isJsonValue(value) ? value : String(value);

export const executeChain = async (
  document: unknown,
  options: ChainExecutionOptions,
): Promise<ChainExecutionResult> => {
  const resolution = await resolveChain(document, options);
  if (!resolution.ok)
    return {
      error: {
        code: "chain_invalid",
        issues: resolution.issues,
        message: "The chain is invalid and was not executed.",
      },
      nodes: [],
      ok: false,
    };

  const { resolved } = resolution;
  const executions: ChainNodeExecution[] = [];
  const outputs = new Map<string, Readonly<Record<string, JsonValue>>>();
  for (const nodeId of resolved.order) {
    if (options.signal?.aborted)
      return {
        error: {
          code: "chain_aborted",
          issues: [],
          message: "Chain execution was canceled.",
          nodeId,
        },
        nodes: executions,
        ok: false,
      };
    const resolvedNode = resolved.nodes.get(nodeId);
    if (!resolvedNode) continue;
    const { node, tool } = resolvedNode;
    const input: Record<string, unknown> = {};
    for (const [portId, value] of Object.entries(node.inputs)) {
      const port = findPort(tool, "inputs", portId);
      if (port) writePath(input, portPath(port), value);
    }
    for (const edge of resolved.document.edges.filter(
      (candidate) => candidate.to.nodeId === nodeId,
    )) {
      const source = outputs.get(edge.from.nodeId);
      const value = source?.[edge.from.portId];
      const port = findPort(tool, "inputs", edge.to.portId);
      if (value !== undefined && port) writePath(input, portPath(port), value);
    }

    let result;
    try {
      result = await tool.execute(input);
    } catch (error) {
      return {
        error: {
          code: "node_threw",
          issues: [],
          message: `Tool ${tool.id} threw while executing.`,
          nodeId,
          toolError: serializableError(error),
        },
        nodes: executions,
        ok: false,
      };
    }
    if (!result.ok)
      return {
        error: {
          code: "node_failed",
          issues: [],
          message: `Tool ${tool.id} rejected its input.`,
          nodeId,
          toolError: result.error,
        },
        nodes: executions,
        ok: false,
      };
    if (!tool.isOutput(result.output) || !isJsonValue(result.output))
      return {
        error: {
          code: "output_invalid",
          issues: [],
          message: `Tool ${tool.id} returned an invalid or non-JSON output.`,
          nodeId,
        },
        nodes: executions,
        ok: false,
      };

    const portOutputs: Record<string, JsonValue> = {};
    for (const port of tool.ports.outputs) {
      const selected = readPath(result.output, portPath(port));
      if (!selected.found || !isJsonValue(selected.value))
        return {
          error: {
            code: "output_invalid",
            issues: [],
            message: `Output ${port.id} was missing or non-JSON.`,
            nodeId,
          },
          nodes: executions,
          ok: false,
        };
      portOutputs[port.id] = selected.value;
    }
    outputs.set(nodeId, portOutputs);
    executions.push({
      id: node.id,
      output: result.output,
      outputs: portOutputs,
      status: "succeeded",
      toolId: tool.id,
      toolVersion: tool.contractVersion,
    });
  }
  return { nodes: executions, ok: true, version: 1 };
};
