import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly term: string;
  readonly senseIndex: number;
  readonly source: string;
};
export type Output = { readonly key: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    term: { type: "string", maxLength: 8192 },
    senseIndex: { type: "integer", minimum: 0 },
    source: { type: "string", maxLength: 8192 },
  },
  required: ["term", "senseIndex", "source"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { key: { type: "string", maxLength: 8192 } },
  required: ["key"],
} as const;
/** Preserve a caller-annotated source-specific term sense without defining the term. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { term, senseIndex, source } = request;
  const compute = (): Output => {
    H.integer(senseIndex, 0);
    H.domain(term.length > 0 && source.length > 0);
    return { key: JSON.stringify([source, term, senseIndex]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { term: "agency", senseIndex: 2, source: "essay-A" },
  output: { key: '["essay-A","agency",2]' },
} satisfies ToolExample<Input, Output>;
export const theoreticalTermSenseIndexTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "critical-theory/theoretical-term-sense-index-token",
    title: "Theoretical Term Sense Index Token Tool",
    description:
      "Preserve a caller-annotated source-specific term sense without defining the term.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        term: { type: "string", maxLength: 8192 },
        senseIndex: { type: "integer", minimum: 0 },
        source: { type: "string", maxLength: 8192 },
      },
      required: ["term", "senseIndex", "source"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { key: { type: "string", maxLength: 8192 } },
      required: ["key"],
    },
    ports: {
      inputs: [
        {
          id: "term",
          label: "Term",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "senseIndex",
          label: "Sense Index",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "source",
          label: "Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "key", label: "Key", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = theoreticalTermSenseIndexTokenTool.execute;
export default theoreticalTermSenseIndexTokenTool;
