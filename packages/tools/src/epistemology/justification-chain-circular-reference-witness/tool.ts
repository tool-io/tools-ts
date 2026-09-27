import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly nodes: readonly string[];
  readonly dependencies: readonly string[];
};
export type Output = {
  readonly circular: boolean;
  readonly witness: readonly string[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    nodes: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    dependencies: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["nodes", "dependencies"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    circular: { type: "boolean" },
    witness: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["circular", "witness"],
} as const;
/** Follow a single-premise justification chain from the first node, returning an explicit reachable cycle or terminating path. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { nodes, dependencies } = request;
  const compute = (): Output => {
    H.domain(
      nodes.length > 0 &&
        nodes.length === dependencies.length &&
        new Set(nodes).size === nodes.length,
    );
    const index = new Map(nodes.map((x, i) => [x, i]));
    const positions = new Map<string, number>();
    const visited: string[] = [];
    let current = nodes[0];
    while (index.has(current)) {
      const prior = positions.get(current);
      if (prior !== undefined)
        return { circular: true, witness: [...visited.slice(prior), current] };
      positions.set(current, visited.length);
      visited.push(current);
      current = dependencies[index.get(current) ?? 0];
    }
    return { circular: false, witness: visited };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { nodes: ["A", "B", "C"], dependencies: ["B", "C", "B"] },
  output: { circular: true, witness: ["B", "C", "B"] },
} satisfies ToolExample<Input, Output>;
export const justificationChainCircularReferenceWitnessTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "epistemology/justification-chain-circular-reference-witness",
      title: "Justification Chain Circular Reference Witness Tool",
      description:
        "Follow a single-premise justification chain from the first node, returning an explicit reachable cycle or terminating path.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          nodes: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          dependencies: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
        },
        required: ["nodes", "dependencies"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          circular: { type: "boolean" },
          witness: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
        },
        required: ["circular", "witness"],
      },
      ports: {
        inputs: [
          {
            id: "nodes",
            label: "Nodes",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "dependencies",
            label: "Dependencies",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
        ],
        outputs: [
          { id: "circular", label: "Circular", valueType: { type: "boolean" } },
          {
            id: "witness",
            label: "Witness",
            valueType: { type: "list", items: { type: "string" } },
          },
        ],
      },
    },
    calculate,
  });
export const run = justificationChainCircularReferenceWitnessTool.execute;
export default justificationChainCircularReferenceWitnessTool;
