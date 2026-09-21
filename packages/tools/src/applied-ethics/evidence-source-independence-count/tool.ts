import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly suppliedIndependenceGroups: readonly string[] };
export type Output = { readonly independentGroups: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    suppliedIndependenceGroups: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["suppliedIndependenceGroups"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { independentGroups: { type: "integer" } },
  required: ["independentGroups"],
} as const;
/** Count caller-declared source-independence groups; independence is not inferred from source identity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { suppliedIndependenceGroups } = request;
  const compute = (): Output => {
    return { independentGroups: new Set(suppliedIndependenceGroups).size };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { suppliedIndependenceGroups: ["g1", "g1", "g2"] },
  output: { independentGroups: 2 },
} satisfies ToolExample<Input, Output>;
export const evidenceSourceIndependenceCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "applied-ethics/evidence-source-independence-count",
    title: "Evidence Source Independence Count Tool",
    description:
      "Count caller-declared source-independence groups; independence is not inferred from source identity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        suppliedIndependenceGroups: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["suppliedIndependenceGroups"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { independentGroups: { type: "integer" } },
      required: ["independentGroups"],
    },
    ports: {
      inputs: [
        {
          id: "suppliedIndependenceGroups",
          label: "Supplied Independence Groups",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "independentGroups",
          label: "Independent Groups",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = evidenceSourceIndependenceCountTool.execute;
export default evidenceSourceIndependenceCountTool;
