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
  readonly unpaired: boolean;
  readonly codeUnitCount: number;
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
    unpaired: { type: "boolean" },
    codeUnitCount: { type: "integer" },
  },
  required: ["unpaired", "codeUnitCount"],
} as const;
/** Compute json unpaired surrogate lexeme flag from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { lexeme } = input;
  const compute = (): Output => {
    const s = text(parseJson(lexeme));
    let unpaired = false;
    for (let i = 0; i < s.length; i++) {
      const c = s.charCodeAt(i);
      if (c >= 0xd800 && c <= 0xdbff) {
        const d = s.charCodeAt(i + 1);
        if (d >= 0xdc00 && d <= 0xdfff) i++;
        else unpaired = true;
      } else if (c >= 0xdc00 && c <= 0xdfff) unpaired = true;
    }
    return { unpaired, codeUnitCount: s.length };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { lexeme: '"\\ud800"' },
  output: { unpaired: true, codeUnitCount: 1 },
} satisfies ToolExample<Input, Output>;
export const jsonUnpairedSurrogateLexemeFlagTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "json/json-unpaired-surrogate-lexeme-flag",
  title: "JSON Unpaired Surrogate Lexeme Flag Tool",
  description:
    "Compute json unpaired surrogate lexeme flag from explicit bounded inputs.",
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
      { id: "unpaired", label: "Unpaired", valueType: { type: "boolean" } },
      {
        id: "codeUnitCount",
        label: "Code Unit Count",
        valueType: { type: "integer" },
      },
    ],
  },
});
export const run = jsonUnpairedSurrogateLexemeFlagTool.execute;
export default jsonUnpairedSurrogateLexemeFlagTool;
