import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly tokens: readonly string[];
  readonly suppliedMarkers: readonly string[];
  readonly caseSensitive: boolean;
};
export type Output = {
  readonly count: number;
  readonly positions: readonly number[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    tokens: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    suppliedMarkers: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    caseSensitive: { type: "boolean" },
  },
  required: ["tokens", "suppliedMarkers", "caseSensitive"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    count: { type: "integer" },
    positions: { type: "array", maxItems: 256, items: { type: "integer" } },
  },
  required: ["count", "positions"],
} as const;
/** Count literal supplied negation markers without determining scope or truth of a claim. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { tokens, suppliedMarkers, caseSensitive } = request;
  const compute = (): Output => {
    const norm = (x: string) => (caseSensitive ? x : x.toLowerCase()),
      set = new Set(suppliedMarkers.map(norm)),
      positions = tokens.flatMap((x, i) => (set.has(norm(x)) ? [i] : []));
    return { count: positions.length, positions };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    tokens: ["NOT", "a", "never"],
    suppliedMarkers: ["not", "never"],
    caseSensitive: false,
  },
  output: { count: 2, positions: [0, 2] },
} satisfies ToolExample<Input, Output>;
export const claimNegationMarkerCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "critical-theory/claim-negation-marker-count",
    title: "Claim Negation Marker Count Tool",
    description:
      "Count literal supplied negation markers without determining scope or truth of a claim.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        tokens: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        suppliedMarkers: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        caseSensitive: { type: "boolean" },
      },
      required: ["tokens", "suppliedMarkers", "caseSensitive"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        count: { type: "integer" },
        positions: { type: "array", maxItems: 256, items: { type: "integer" } },
      },
      required: ["count", "positions"],
    },
    ports: {
      inputs: [
        {
          id: "tokens",
          label: "Tokens",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "suppliedMarkers",
          label: "Supplied Markers",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "caseSensitive",
          label: "Case Sensitive",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "count", label: "Count", valueType: { type: "integer" } },
        {
          id: "positions",
          label: "Positions",
          valueType: { type: "list", items: { type: "integer" } },
        },
      ],
    },
  },
  calculate,
});
export const run = claimNegationMarkerCountTool.execute;
export default claimNegationMarkerCountTool;
