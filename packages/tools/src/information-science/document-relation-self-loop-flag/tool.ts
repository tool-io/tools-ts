import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly source: string; readonly target: string };
export type Output = { readonly selfLoop: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    source: { type: "string", maxLength: 8192 },
    target: { type: "string", maxLength: 8192 },
  },
  required: ["source", "target"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { selfLoop: { type: "boolean" } },
  required: ["selfLoop"],
} as const;
/** Inspect exact supplied document identities on one directed relation edge. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { source, target } = request;
  const compute = (): Output => {
    return { selfLoop: source === target };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { source: "a", target: "a" },
  output: { selfLoop: true },
} satisfies ToolExample<Input, Output>;
export const documentRelationSelfLoopFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "information-science/document-relation-self-loop-flag",
    title: "Document Relation Self Loop Flag Tool",
    description:
      "Inspect exact supplied document identities on one directed relation edge.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        source: { type: "string", maxLength: 8192 },
        target: { type: "string", maxLength: 8192 },
      },
      required: ["source", "target"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { selfLoop: { type: "boolean" } },
      required: ["selfLoop"],
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
      ],
      outputs: [
        { id: "selfLoop", label: "Self Loop", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = documentRelationSelfLoopFlagTool.execute;
export default documentRelationSelfLoopFlagTool;
