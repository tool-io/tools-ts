import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly pathTokens: readonly string[];
  readonly countRoot: boolean;
};
export type Output = { readonly levels: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pathTokens: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    countRoot: { type: "boolean" },
  },
  required: ["pathTokens", "countRoot"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { levels: { type: "integer" } },
  required: ["levels"],
} as const;
/** Count supplied hierarchy components without inferring geographic containment. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { pathTokens, countRoot } = request;
  const compute = (): Output => {
    return { levels: Math.max(0, pathTokens.length - (countRoot ? 0 : 1)) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { pathTokens: ["world", "region", "town"], countRoot: false },
  output: { levels: 2 },
} satisfies ToolExample<Input, Output>;
export const placeHierarchyLevelCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "area-studies/place-hierarchy-level-count",
    title: "Place Hierarchy Level Count Tool",
    description:
      "Count supplied hierarchy components without inferring geographic containment.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        pathTokens: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        countRoot: { type: "boolean" },
      },
      required: ["pathTokens", "countRoot"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { levels: { type: "integer" } },
      required: ["levels"],
    },
    ports: {
      inputs: [
        {
          id: "pathTokens",
          label: "Path Tokens",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "countRoot",
          label: "Count Root",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "levels", label: "Levels", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = placeHierarchyLevelCountTool.execute;
export default placeHierarchyLevelCountTool;
