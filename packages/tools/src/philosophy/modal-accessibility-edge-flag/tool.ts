import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly source: string;
  readonly target: string;
  readonly sources: readonly string[];
  readonly targets: readonly string[];
};
export type Output = {
  readonly accessible: boolean;
  readonly edgeCount: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    source: { type: "string", maxLength: 8192 },
    target: { type: "string", maxLength: 8192 },
    sources: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    targets: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["source", "target", "sources", "targets"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    accessible: { type: "boolean" },
    edgeCount: { type: "integer" },
  },
  required: ["accessible", "edgeCount"],
} as const;
/** Inspect explicitly listed directed accessibility edges without assuming modal frame axioms. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { source, target, sources, targets } = request;
  const compute = (): Output => {
    H.sameLength(sources, targets);
    return {
      accessible: sources.some((x, i) => x === source && targets[i] === target),
      edgeCount: sources.filter((x, i) => x === source && targets[i] === target)
        .length,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    source: "w1",
    target: "w2",
    sources: ["w1", "w2"],
    targets: ["w2", "w3"],
  },
  output: { accessible: true, edgeCount: 1 },
} satisfies ToolExample<Input, Output>;
export const modalAccessibilityEdgeFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "philosophy/modal-accessibility-edge-flag",
    title: "Modal Accessibility Edge Flag Tool",
    description:
      "Inspect explicitly listed directed accessibility edges without assuming modal frame axioms.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        source: { type: "string", maxLength: 8192 },
        target: { type: "string", maxLength: 8192 },
        sources: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        targets: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["source", "target", "sources", "targets"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        accessible: { type: "boolean" },
        edgeCount: { type: "integer" },
      },
      required: ["accessible", "edgeCount"],
    },
    ports: {
      inputs: [
        {
          id: "source",
          label: "Source",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "target",
          label: "Target",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "sources",
          label: "Sources",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "targets",
          label: "Targets",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "accessible",
          label: "Accessible",
          valueType: { type: "boolean" },
        },
        {
          id: "edgeCount",
          label: "Edge Count",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = modalAccessibilityEdgeFlagTool.execute;
export default modalAccessibilityEdgeFlagTool;
