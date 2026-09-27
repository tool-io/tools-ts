import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly chainIds: readonly string[];
  readonly repeatedIdTerminates: boolean;
};
export type Output = {
  readonly depth: number;
  readonly cycleDetected: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    chainIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    repeatedIdTerminates: { type: "boolean" },
  },
  required: ["chainIds", "repeatedIdTerminates"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    depth: { type: "integer" },
    cycleDetected: { type: "boolean" },
  },
  required: ["depth", "cycleDetected"],
} as const;
/** Inspect one caller-supplied evidence-reference chain without inferring evidential reliability. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { chainIds, repeatedIdTerminates } = request;
  const compute = (): Output => {
    const seen = new Set<string>();
    let depth = 0,
      cycleDetected = false;
    for (const id of chainIds) {
      if (seen.has(id)) {
        cycleDetected = true;
        if (repeatedIdTerminates) break;
      }
      seen.add(id);
      depth++;
    }
    return { depth, cycleDetected };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { chainIds: ["A", "B", "C", "B"], repeatedIdTerminates: true },
  output: { depth: 3, cycleDetected: true },
} satisfies ToolExample<Input, Output>;
export const evidenceChainDepthTool = H.defineSchemaCalculation<Input, Output>({
  ...{
    id: "epistemology/evidence-chain-depth",
    title: "Evidence Chain Depth Tool",
    description:
      "Inspect one caller-supplied evidence-reference chain without inferring evidential reliability.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        chainIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        repeatedIdTerminates: { type: "boolean" },
      },
      required: ["chainIds", "repeatedIdTerminates"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        depth: { type: "integer" },
        cycleDetected: { type: "boolean" },
      },
      required: ["depth", "cycleDetected"],
    },
    ports: {
      inputs: [
        {
          id: "chainIds",
          label: "Chain Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "repeatedIdTerminates",
          label: "Repeated Id Terminates",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "depth", label: "Depth", valueType: { type: "integer" } },
        {
          id: "cycleDetected",
          label: "Cycle Detected",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = evidenceChainDepthTool.execute;
export default evidenceChainDepthTool;
