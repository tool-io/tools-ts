import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly from: string;
  readonly to: string;
  readonly reverseReachabilityPath: readonly string[];
};
export type Output = {
  readonly cycleWitness: boolean;
  readonly witness: readonly string[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    from: { type: "string", maxLength: 8192 },
    to: { type: "string", maxLength: 8192 },
    reverseReachabilityPath: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["from", "to", "reverseReachabilityPath"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cycleWitness: { type: "boolean" },
    witness: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["cycleWitness", "witness"],
} as const;
/** Compose a proposed edge with a caller-asserted directed reverse path; this does not verify path edges against a graph. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { from, to, reverseReachabilityPath } = request;
  const compute = (): Output => {
    H.domain(
      from.length > 0 && to.length > 0 && reverseReachabilityPath.length <= 255,
    );
    const cycleWitness =
      from === to ||
      (reverseReachabilityPath.length >= 2 &&
        reverseReachabilityPath[0] === to &&
        reverseReachabilityPath[reverseReachabilityPath.length - 1] === from);
    return {
      cycleWitness,
      witness: cycleWitness
        ? from === to
          ? [from, from]
          : [from, ...reverseReachabilityPath]
        : [],
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { from: "A", to: "B", reverseReachabilityPath: ["B", "C", "A"] },
  output: { cycleWitness: true, witness: ["A", "B", "C", "A"] },
} satisfies ToolExample<Input, Output>;
export const edgeRoleDagBackEdgeWitnessTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "graph/edge-role-dag-back-edge-witness",
    title: "Edge Role DAG Back Edge Witness Tool",
    description:
      "Compose a proposed edge with a caller-asserted directed reverse path; this does not verify path edges against a graph.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        from: { type: "string", maxLength: 8192 },
        to: { type: "string", maxLength: 8192 },
        reverseReachabilityPath: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["from", "to", "reverseReachabilityPath"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        cycleWitness: { type: "boolean" },
        witness: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["cycleWitness", "witness"],
    },
    ports: {
      inputs: [
        {
          id: "from",
          label: "From",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "to",
          label: "To",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "reverseReachabilityPath",
          label: "Reverse Reachability Path",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "cycleWitness",
          label: "Cycle Witness",
          valueType: { type: "boolean" },
        },
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
export const run = edgeRoleDagBackEdgeWitnessTool.execute;
export default edgeRoleDagBackEdgeWitnessTool;
