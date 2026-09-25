import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly line: string };
export type Output = { readonly recipe: boolean; readonly body: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { line: { type: "string", maxLength: 8192 } },
  required: ["line"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recipe: { type: "boolean" },
    body: { type: "string", maxLength: 8192 },
  },
  required: ["recipe", "body"],
} as const;
/** Calculate makefile recipe tab prefix from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { line } = input;
  const compute = (): Output => {
    const recipe = line.startsWith("\t");
    return { recipe, body: recipe ? line.slice(1) : line };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { line: "\techo hello" },
  output: { recipe: true, body: "echo hello" },
} satisfies ToolExample<Input, Output>;
export const makefileRecipeTabPrefixTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "development/makefile-recipe-tab-prefix",
    title: "Makefile Recipe Tab Prefix Tool",
    description:
      "Calculate makefile recipe tab prefix from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { line: { type: "string", maxLength: 8192 } },
      required: ["line"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recipe: { type: "boolean" },
        body: { type: "string", maxLength: 8192 },
      },
      required: ["recipe", "body"],
    },
    ports: {
      inputs: [
        {
          id: "line",
          label: "Line",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "recipe", label: "Recipe", valueType: { type: "boolean" } },
        { id: "body", label: "Body", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = makefileRecipeTabPrefixTool.execute;
export default makefileRecipeTabPrefixTool;
