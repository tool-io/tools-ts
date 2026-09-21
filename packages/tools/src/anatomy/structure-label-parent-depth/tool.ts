import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly ancestors: readonly string[];
  readonly includeSelf: boolean;
};
export type Output = { readonly depth: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    ancestors: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    includeSelf: { type: "boolean" },
  },
  required: ["ancestors", "includeSelf"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { depth: { type: "integer" } },
  required: ["depth"],
} as const;
/** Count explicitly supplied ancestor labels with optional self inclusion, without anatomical ontology lookup. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { ancestors, includeSelf } = request;
  const compute = (): Output => {
    return { depth: ancestors.length + (includeSelf ? 1 : 0) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { ancestors: ["root", "parent"], includeSelf: true },
  output: { depth: 3 },
} satisfies ToolExample<Input, Output>;
export const structureLabelParentDepthTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "anatomy/structure-label-parent-depth",
    title: "Structure Label Parent Depth Tool",
    description:
      "Count explicitly supplied ancestor labels with optional self inclusion, without anatomical ontology lookup.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        ancestors: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        includeSelf: { type: "boolean" },
      },
      required: ["ancestors", "includeSelf"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { depth: { type: "integer" } },
      required: ["depth"],
    },
    ports: {
      inputs: [
        {
          id: "ancestors",
          label: "Ancestors",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "includeSelf",
          label: "Include Self",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "depth", label: "Depth", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = structureLabelParentDepthTool.execute;
export default structureLabelParentDepthTool;
