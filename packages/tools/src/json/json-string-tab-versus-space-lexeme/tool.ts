import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  parseJson,
  text,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly lexeme: string };
export type Output = {
  readonly tabs: number;
  readonly spaces: number;
  readonly decodedLength: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { lexeme: { type: "string", maxLength: 8192 } },
  required: ["lexeme"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    tabs: { type: "integer" },
    spaces: { type: "integer" },
    decodedLength: { type: "integer" },
  },
  required: ["tabs", "spaces", "decodedLength"],
} as const;
/** Compute json string tab versus space lexeme from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { lexeme } = input;
  const compute = (): Output => {
    const value = text(parseJson(lexeme));
    return {
      tabs: [...value].filter((x) => x === "\t").length,
      spaces: [...value].filter((x) => x === " ").length,
      decodedLength: value.length,
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { lexeme: '"a\\tb c"' },
  output: { tabs: 1, spaces: 1, decodedLength: 5 },
} satisfies ToolExample<Input, Output>;
export const jsonStringTabVersusSpaceLexemeTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "json/json-string-tab-versus-space-lexeme",
  title: "JSON String Tab Versus Space Lexeme Tool",
  description:
    "Compute json string tab versus space lexeme from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "lexeme",
        label: "Lexeme",
        required: true,
        valueType: { type: "string" },
      },
    ],
    outputs: [
      { id: "tabs", label: "Tabs", valueType: { type: "integer" } },
      { id: "spaces", label: "Spaces", valueType: { type: "integer" } },
      {
        id: "decodedLength",
        label: "Decoded Length",
        valueType: { type: "integer" },
      },
    ],
  },
});
export const run = jsonStringTabVersusSpaceLexemeTool.execute;
export default jsonStringTabVersusSpaceLexemeTool;
